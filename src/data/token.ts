import ApolloClient, { Resolvers } from 'apollo-client';
import { isAddress } from 'web3-utils';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { ClientType, ColonyClient } from '@colony/colony-js';

import { Context, ContextModule } from '~context/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { createAddress } from '~utils/web3';
import { TokenInfo, TokenInfoDocument } from '~data/index';
import { Address } from '~types/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

const ETHER_INFO = Object.freeze({
  id: AddressZero,
  address: AddressZero,
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  verified: true,
  iconHash: '',
});

// Token data is used a lot and never change. They require a custom cache
const tokenCache = new Map();

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
      ...ETHER_INFO,
    };
  }

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
  };
};

export const getToken = (
  {
    colonyManager,
    client,
  }: {
    colonyManager: Required<Context>[ContextModule.ColonyManager];
    client: ApolloClient<object>;
  },
  address: Address,
) => {
  if (tokenCache.has(address)) return tokenCache.get(address);
  const promise = getTokenData({ colonyManager, client }, address);
  tokenCache.set(address, promise);
  return promise;
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
      return Promise.all(
        addresses.map((address) =>
          getToken({ colonyManager, client }, address),
        ),
      );
    },
  },
  Token: {
    async balance({ address }, { walletAddress }) {
      const {
        networkClient: {
          adapter: { provider },
        },
      } = colonyManager;
      if (address === AddressZero) {
        const balance = await provider.getBalance(walletAddress);
        return balance.toString();
      }

      const tokenClient = await colonyManager.getTokenClient(address);
      const amount = await tokenClient.balanceOf(walletAddress);
      return amount.toString();
    },
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
  },
});
