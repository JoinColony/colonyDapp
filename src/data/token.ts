import ApolloClient, { Resolvers } from 'apollo-client';
import { isAddress } from 'web3-utils';
import BigNumber from 'bn.js';

import { ContextType } from '~context/index';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { ZERO_ADDRESS, ETHER_INFO } from '~utils/web3/constants';
import { TokenInfo, TokenInfoDocument } from '~data/index';
import { Address } from '~types/index';

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

export const tokenResolvers = ({ colonyManager }: ContextType): Resolvers => ({
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
    async details(
      { address },
      _,
      { client }: { client: ApolloClient<object> },
    ) {
      const tokenAddress = address === '0x0' ? ZERO_ADDRESS : address;

      if (!isAddress(tokenAddress)) {
        // don't bother looking it up if it's an invalid token address
        throw Error('Invalid token address');
      }

      // If we're asking for ETH, just return static data
      if (tokenAddress === ZERO_ADDRESS) {
        return {
          __typename: 'TokenInfo',
          verified: true,
          ...ETHER_INFO,
        };
      }

      const tokenClient = await colonyManager.getTokenClient(tokenAddress);
      const chainData: TokenInfo = await tokenClient.getTokenInfo.call();

      let ethplorerData = {} as TokenInfo;

      // Token verification using ethplorer only really works on mainnet
      if (process.env.NETWORK === 'mainnet') {
        try {
          ethplorerData = await getEthplorerTokenData(tokenAddress);
        } catch (err) {
          console.warn(`Could not verify token details for ${tokenAddress}`);
        }
      }

      const { data: serverDataResult } = await client.query({
        query: TokenInfoDocument,
        variables: { address: tokenAddress },
      });

      const serverData: TokenInfo = serverDataResult
        ? serverDataResult.token.info
        : {};

      const tokenInfo = {
        __typename: 'TokenInfo',
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
