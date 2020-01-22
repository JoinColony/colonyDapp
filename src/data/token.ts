import ApolloClient, { Resolvers } from 'apollo-client';
import { isAddress } from 'web3-utils';
import BigNumber from 'bn.js';

import { ContextType } from '~context/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { ZERO_ADDRESS, ETHER_INFO } from '~utils/web3/constants';
import { TokenInfo, TokenInfoDocument } from '~data/index';
import { Address } from '~types/index';

// Token data is used a lot and never change. They require a custom cache
const tokenCache = new Map();

const getBalanceForTokenAndDomain = async (
  colonyClient,
  tokenAddress,
  domainId,
): Promise<BigNumber> => {
  const { potId } = await colonyClient.getDomain.call({ domainId });
  const {
    balance: rewardsPotTotal,
  } = await colonyClient.getFundingPotBalance.call({
    potId,
    token: tokenAddress,
  });
  if (domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    const {
      total: nonRewardsPotsTotal,
    } = await colonyClient.getNonRewardPotsTotal.call({
      token: tokenAddress,
    });
    return new BigNumber(nonRewardsPotsTotal.add(rewardsPotTotal).toString(10));
  }
  return new BigNumber(rewardsPotTotal.toString(10));
};

const getTokenData = async (
  {
    colonyManager,
    client,
  }: {
    colonyManager: ContextType['colonyManager'];
    client: ApolloClient<object>;
  },
  address: Address,
) => {
  const tokenAddress = address === '0x0' ? ZERO_ADDRESS : address;

  if (!isAddress(tokenAddress)) {
    // don't bother looking it up if it's an invalid token address
    throw Error('Invalid token address');
  }

  // If we're asking for ETH, just return static data
  if (tokenAddress === ZERO_ADDRESS) {
    return {
      __typename: 'Token',
      verified: true,
      ...ETHER_INFO,
    };
  }

  const tokenClient = await colonyManager.getTokenClient(tokenAddress);
  const chainData: TokenInfo = await tokenClient.getTokenInfo.call();

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
    address: tokenAddress,
    decimals: chainData.decimals || serverData.decimals || 18,
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
    colonyManager: ContextType['colonyManager'];
    client: ApolloClient<object>;
  },
  address: Address,
) => {
  if (tokenCache.has(address)) return tokenCache.get(address);
  const promise = getTokenData({ colonyManager, client }, address);
  tokenCache.set(address, promise);
  return promise;
};

export const tokenResolvers = ({ colonyManager }: ContextType): Resolvers => ({
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
        addresses.map(address => getToken({ colonyManager, client }, address)),
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
      if (address === ZERO_ADDRESS) {
        const balance = provider.getBalance(walletAddress);
        return balance.toString();
      }

      const tokenClient = await colonyManager.getTokenClient(address);
      const { amount } = await tokenClient.getBalanceOf.call({
        sourceAddress: walletAddress,
      });
      return amount.toString();
    },
    async balances(
      { address }: { address: Address },
      {
        colonyAddress,
        domainIds = [0, 1],
      }: { colonyAddress: Address; domainIds?: number[] },
    ) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);

      const balances: BigNumber[] = await Promise.all(
        domainIds.map(domainId =>
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
