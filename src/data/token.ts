import ApolloClient, { Resolvers } from 'apollo-client';
import { isAddress } from 'web3-utils';
import BigNumber from 'bn.js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { ZERO_ADDRESS, ETHER_INFO } from '~utils/web3/constants';
import { TokenInfo, TokenInfoDocument } from '~data/index';

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

const getEthplorerTokenData = async (address: string): Promise<TokenInfo> => {
  // eslint-disable-next-line max-len, prettier/prettier
  const endpoint = `//api.ethplorer.io/getTokenInfo/${address}?apiKey=${process
    .env.ETHPLORER_API_KEY || 'freekey'}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  if (data.error) {
    throw new Error(`Ethplorer error: ${data.error.message}`);
  }
  const { name, symbol, decimals } = data;
  const tokenDetails = {
    name,
    symbol,
    decimals: parseInt(decimals, 10),
    verified: true,
  };
  return tokenDetails;
};

export const tokenResolvers = ({
  colonyManager,
  // FIXME type this
}): Resolvers => ({
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
    async balances({ address }, { colonyAddress, domainIds }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      // FIXME somehow we have to get ETHER into this (on the server?)

      const balances: BigNumber[] = await Promise.all(
        domainIds.map(domainId =>
          getBalanceForTokenAndDomain(colonyClient, address, domainId),
        ),
      );

      return domainIds.map((domainId, idx) => ({
        domainId,
        balance: balances[idx].toString(),
        __typename: 'DomainBalance',
      }));
    },
    async details(
      { address },
      _,
      { client }: { client: ApolloClient<object> },
    ) {
      if (!isAddress(address)) {
        // don't bother looking it up if it's an invalid token address
        throw Error('Invalid token address');
      }

      // If we're asking for ETH, just return static data
      if (address === ZERO_ADDRESS) {
        return {
          isVerified: true,
          ...ETHER_INFO,
        };
      }

      const tokenClient = await colonyManager.getTokenClient(address);
      const chainData: TokenInfo = await tokenClient.getTokenInfo.call();

      let ethplorerData = {} as TokenInfo;

      try {
        ethplorerData = await getEthplorerTokenData(address);
      } catch (err) {
        console.warn(`Could not verify token details for ${address}`);
      }

      const { data: serverDataResult } = await client.query({
        query: TokenInfoDocument,
        variables: { address },
      });

      const serverData: TokenInfo = serverDataResult
        ? serverDataResult.token.info
        : {};

      const tokenInfo = {
        name: chainData.name || ethplorerData.name || serverData.name,
        decimals:
          chainData.decimals || ethplorerData.decimals || serverData.decimals,
        symbol: chainData.symbol || ethplorerData.symbol || serverData.symbol,
        verified: ethplorerData.verified || false,
      };

      return tokenInfo;
    },
  },
});
