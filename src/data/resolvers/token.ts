import { ApolloClient, Resolvers } from '@apollo/client';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { ClientType, ColonyClient } from '@colony/colony-js';

import { Context, ContextModule } from '~context/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  DEFAULT_NETWORK_TOKEN,
} from '~constants';
import {
  TokenInfo,
  TokenInfoDocument,
  SubgraphDomainsQuery,
  SubgraphDomainsQueryVariables,
  SubgraphDomainsDocument,
} from '~data/index';
import { Address } from '~types/index';
import { createAddress, isAddress } from '~utils/web3';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

const TOKEN_INFO = Object.freeze({
  id: AddressZero,
  address: AddressZero,
  verified: true,
  iconHash: '',
  ...DEFAULT_NETWORK_TOKEN,
});

const getBalanceForTokenAndDomain = async (
  colonyClient: ColonyClient,
  tokenAddress: string,
  domainId: number,
): Promise<BigNumber> => {
  const { fundingPotId } = await colonyClient.getDomain(domainId);
  const rewardsPotTotal = await colonyClient.getFundingPotBalance(
    fundingPotId,
    tokenAddress,
  );
  if (domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    const nonRewardsPotsTotal = await colonyClient.getNonRewardPotsTotal(
      tokenAddress,
    );
    return bigNumberify(nonRewardsPotsTotal.add(rewardsPotTotal).toString());
  }
  return bigNumberify(rewardsPotTotal.toString());
};

const getTokenData = async (
  {
    colonyManager,
    client,
  }: {
    colonyManager: Required<Context>[ContextModule.ColonyManager];
    client: ApolloClient<object>;
  },
  address: Address,
) => {
  const tokenAddress = address === '0x0' ? AddressZero : address;

  if (!isAddress(tokenAddress)) {
    // don't bother looking it up if it's an invalid token address
    throw Error('Invalid token address');
  }

  // If we're asking for ETH, just return static data
  if (tokenAddress === AddressZero) {
    return {
      __typename: 'Token',
      verified: true,
      ...TOKEN_INFO,
    };
  }

  try {
    const tokenClient = await colonyManager.getTokenClient(tokenAddress);
    const chainData = await tokenClient.getTokenInfo();

    let serverDataResult;
    try {
      const { data } = await client.query({
        query: TokenInfoDocument,
        variables: { address: tokenAddress },
      });
      serverDataResult = data;
    } catch (e) {
      console.warn(`Server error for token with address ${tokenAddress}`, e);
    }

    const serverData: TokenInfo = serverDataResult
      ? serverDataResult.tokenInfo
      : {};

    return {
      __typename: 'Token',
      id: tokenAddress,
      /*
       * @NOTE Checksum the token address before returning it
       * This is only needed for legacy reasons as not all entries in the
       * database are checksummed, so this, while cosuming more cycles, will
       * prevent us headache in the future
       */
      address: createAddress(tokenAddress),
      decimals: getTokenDecimalsWithFallback(
        chainData.decimals,
        serverData.decimals,
      ),
      iconHash: serverData.iconHash || null,
      name: chainData.name || serverData.name || 'Unknown token',
      symbol: chainData.symbol || serverData.symbol || '???',
      verified: serverData.verified || false,
      balance: '',
    };
  } catch (error) {
    console.error('Could not fetch Colony token:', tokenAddress);
    console.error(error);
    return null;
  }
};

export const getToken = async (
  {
    colonyManager,
    client,
  }: {
    colonyManager: Required<Context>[ContextModule.ColonyManager];
    client: ApolloClient<object>;
  },
  address: Address,
  walletAddress?: Address,
) => {
  const tokenData = await getTokenData({ colonyManager, client }, address);

  if (walletAddress !== undefined && tokenData !== null) {
    const { provider } = colonyManager;

    if (address === AddressZero) {
      const balance = await provider.getBalance(walletAddress);
      tokenData.balance = balance.toString();
    } else {
      const tokenClient = await colonyManager.getTokenClient(address);
      const amount = await tokenClient.balanceOf(walletAddress);

      tokenData.balance = amount.toString();
    }
  }

  return tokenData;
};

export const tokenResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async token(
      _,
      { address }: { address: Address },
      { client }: { client: ApolloClient<object> },
    ) {
      return getToken({ colonyManager, client }, address);
    },
    async tokens(
      _,
      { addresses }: { addresses: Address[] },
      { client }: { client: ApolloClient<object> },
    ) {
      const tokens = await Promise.all(
        addresses.map(async (address) =>
          getToken({ colonyManager, client }, address),
        ),
      );
      return tokens.filter((token) => !!token);
    },
    async domainBalance(_, { colonyAddress, tokenAddress, domainId }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      const balance = await getBalanceForTokenAndDomain(
        colonyClient,
        tokenAddress,
        domainId,
      );

      return balance.toString();
    },
  },
  Token: {
    async balances(
      { address }: { address: Address },
      {
        colonyAddress,
        domainIds = [0, 1],
      }: { colonyAddress: Address; domainIds?: number[] },
    ) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      const balances: BigNumber[] = await Promise.all(
        domainIds.map((domainId) =>
          getBalanceForTokenAndDomain(colonyClient, address, domainId),
        ),
      );

      return domainIds.map((domainId, idx) => ({
        __typename: 'DomainBalance',
        amount: balances[idx].toString(),
        domainId,
        // `address` & `colonyAddress` only used for cache key - NOT PART OF QUERY
        address,
        colonyAddress,
      }));
    },
    async processedBalances(
      { address }: { address: Address },
      { colonyAddress }: { colonyAddress: Address },
      { client }: { client: ApolloClient<object> },
    ) {
      try {
        const { data } = await client.query<
          SubgraphDomainsQuery,
          SubgraphDomainsQueryVariables
        >({
          query: SubgraphDomainsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
          },
          fetchPolicy: 'network-only',
        });

        if (data?.domains) {
          const domains = [...data.domains, { domainChainId: '0' }];

          const colonyClient = await colonyManager.getClient(
            ClientType.ColonyClient,
            colonyAddress,
          );

          const balances: BigNumber[] = await Promise.all(
            domains.map((domain) =>
              getBalanceForTokenAndDomain(
                colonyClient,
                address,
                Number(domain.domainChainId),
              ),
            ),
          );

          return domains.map((domain, idx) => ({
            __typename: 'DomainBalance',
            amount: balances[idx].toString(),
            domainId: Number(domain.domainChainId),
            // `address` & `colonyAddress` only used for cache key - NOT PART OF QUERY
            address,
            colonyAddress,
          }));
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
