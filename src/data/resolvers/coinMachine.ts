import {
  ClientType,
  getLogs,
  getBlockTime,
  CoinMachineClientV2,
} from '@colony/colony-js';
import { Resolvers } from '@apollo/client';
import { BigNumber, bigNumberify, BigNumberish } from 'ethers/utils';

import { Context } from '~context/index';
import {
  SubgraphCoinMachinePeriodsQuery,
  SubgraphCoinMachinePeriodsQueryVariables,
  SubgraphCoinMachinePeriodsDocument,
} from '~data/index';
import { createAddress } from '~utils/web3';
import { parseSubgraphEvent } from '~utils/events';
import { getCoinMachinePeriodPrice } from '~utils/contracts';
import { ColonyAndExtensionsEvents } from '~types/colonyActions';

import { getToken } from './token';

/*
 * Small helper to replay TokensBought / Transfer events over a reversed
 * period array in order to generate a historic available tokens total
 */
const replayBalanceEvents = (
  {
    name,
    values,
  }: { name: string; values: { wad: BigNumber; numTokens: BigNumber } },
  total: BigNumber,
): BigNumber => {
  let aggregator = total;
  if (name === ColonyAndExtensionsEvents.Transfer) {
    aggregator = aggregator.sub(bigNumberify(values.wad.toString()));
  }
  if (name === ColonyAndExtensionsEvents.TokensBought) {
    aggregator = aggregator.add(bigNumberify(values.numTokens.toString()));
  }
  return aggregator;
};

export const coinMachineResolvers = ({
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async coinMachineSaleTokens(_, { colonyAddress }) {
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );

        const sellableTokenAddress = createAddress(
          await coinMachineClient.getToken(),
        );
        const purchaseTokenAddress = createAddress(
          await coinMachineClient.getPurchaseToken(),
        );

        const sellableToken = await getToken(
          { colonyManager, client: apolloClient },
          sellableTokenAddress,
        );
        const purchaseToken = await getToken(
          { colonyManager, client: apolloClient },
          purchaseTokenAddress,
        );

        return {
          sellableToken,
          purchaseToken,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineCurrentPeriodPrice(_, { colonyAddress }) {
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );

        const currentPrice = await coinMachineClient.getCurrentPrice();
        return currentPrice.toString();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineBoughtTokens(_, { colonyAddress, transactionHash }) {
      const { provider } = colonyManager.networkClient;
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );

        const boughtTokensFilter = coinMachineClient.filters.TokensBought(
          null,
          null,
          null,
        );

        const boughtTokensLogs = await getLogs(
          coinMachineClient,
          boughtTokensFilter,
        );

        const boughtTokensEvents = await Promise.all(
          boughtTokensLogs.map(async (log) => {
            const parsedLog = coinMachineClient.interface.parseLog(log);
            const {
              blockHash,
              transactionHash: currentLogTransactionHash,
            } = log;
            return {
              ...parsedLog,
              transactionHash: currentLogTransactionHash,
              createdAt: blockHash
                ? await getBlockTime(provider, blockHash)
                : 0,
            };
          }),
        );
        const lastBoughtTokensEvent = boughtTokensEvents
          .sort(
            (firstEvent, secondEvent) =>
              secondEvent.createdAt - firstEvent.createdAt,
          )
          .find((event) => event.transactionHash === transactionHash);

        return {
          numTokens: lastBoughtTokensEvent?.values.numTokens?.toString() || '0',
          totalCost: lastBoughtTokensEvent?.values.totalCost?.toString() || '0',
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineTransactionAmount(_, { colonyAddress, transactionHash }) {
      const { provider } = colonyManager.networkClient;
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );
        const transaction = await provider.getTransaction(transactionHash);
        const transactionReceipt = await provider.getTransactionReceipt(
          transactionHash,
        );
        const actionValues = coinMachineClient.interface.parseTransaction({
          data: transaction.data,
        });

        return {
          transactionAmount: actionValues?.args[0].toString() || '0',
          transactionSucceed: !!transactionReceipt.status,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineCurrentPeriodMaxUserPurchase(
      _,
      { userAddress, colonyAddress },
    ) {
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );

        const maxUserPurchase = await coinMachineClient.getMaxPurchase(
          userAddress,
        );
        return maxUserPurchase.toString();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineCurrentSalePeriod(_, { colonyAddress }) {
      try {
        const { networkClient } = colonyManager;
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );
        const periodLength = await coinMachineClient.getPeriodLength();
        const blockTime = await getBlockTime(networkClient.provider, 'latest');
        const periodLengthInMs = periodLength.mul(1000);
        const timeRemaining = periodLengthInMs.sub(
          bigNumberify(blockTime).mod(periodLengthInMs),
        );
        return {
          periodLength: periodLength.toString(),
          timeRemaining: timeRemaining.toString(),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async currentPeriodTokens(_, { colonyAddress }) {
      try {
        const { networkClient } = colonyManager;

        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );

        const maxPerPeriodTokens = await coinMachineClient.getMaxPerPeriod();

        const activeSoldTokens = await coinMachineClient.getActiveSold();
        const activePeriod = await coinMachineClient.getActivePeriod();
        const blockTime = await getBlockTime(networkClient.provider, 'latest');

        const periodLength = await coinMachineClient.getPeriodLength();

        const currentPeriod = Math.floor(
          bigNumberify(blockTime).div(periodLength.mul(1000)).toNumber(),
        );

        // eslint-disable-next-line max-len
        const targetPerPeriodTokens = await coinMachineClient.getTargetPerPeriod();

        return {
          maxPerPeriodTokens: maxPerPeriodTokens.toString(),
          activeSoldTokens:
            activePeriod.toNumber() === currentPeriod
              ? activeSoldTokens.toString()
              : '',
          targetPerPeriodTokens: targetPerPeriodTokens.toString(),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineTokenBalance(_, { colonyAddress }) {
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );
        const tokenBalance = await coinMachineClient.getTokenBalance();

        return tokenBalance.toString();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    /*
     * WARNING!
     *
     * This is one of the most complicated client resolver we have to date
     * As it attempts to replicate a bunch of on-chain logic and functionality
     * This is due to the graph not supporting block handlers (in a production
     * environment) forcing us to simulate period updates and state reconciliation
     * in the client
     */
    async coinMachineSalePeriods(_, { colonyAddress, limit }) {
      try {
        const { networkClient } = colonyManager;
        const coinMachineClient = (await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        )) as CoinMachineClientV2;

        const subgraphData = await apolloClient.query<
          SubgraphCoinMachinePeriodsQuery,
          SubgraphCoinMachinePeriodsQueryVariables
        >({
          query: SubgraphCoinMachinePeriodsDocument,
          variables: {
            colonyAddress: colonyAddress.toLowerCase(),
            extensionAddress: coinMachineClient.address.toLowerCase(),
            limit,
          },
          fetchPolicy: 'network-only',
        });

        const extensionInitialisedLogs = await getLogs(
          coinMachineClient,
          coinMachineClient.filters.ExtensionInitialised(),
        );
        const extensionInitialisedAt = await networkClient.provider.getBlock(
          extensionInitialisedLogs[0].blockNumber || '',
        );

        const periodLength = (await coinMachineClient.getPeriodLength()).mul(
          1000,
        );
        const availableTokens = await coinMachineClient.getTokenBalance();
        const targetPerPeriod = await coinMachineClient.getTargetPerPeriod();
        const windowSize = await coinMachineClient.getWindowSize();
        const currentBlock = await networkClient.provider.getBlock('latest');
        const currentBlockTime = currentBlock.timestamp * 1000;

        let latestPeriodStart = currentBlockTime;
        while (latestPeriodStart % periodLength.toNumber() !== 0) {
          latestPeriodStart -= 1000;
        }
        let latestPeriodEnd = latestPeriodStart;

        const stalePeriods: Array<{
          saleEndedAt: number;
          tokensBought: BigNumberish;
          tokensAvailable: BigNumberish;
          price: BigNumberish;
        }> = [];

        /*
         * Generate stale periods up to the limit
         */
        for (let index = 0; index < limit; index += 1) {
          stalePeriods.push({
            saleEndedAt: latestPeriodEnd,
            tokensBought: bigNumberify(0),
            tokensAvailable:
              index === 0
                ? bigNumberify(availableTokens.toString())
                : bigNumberify(0),
            price: bigNumberify(0),
          });
          latestPeriodEnd -= periodLength.toNumber();
        }

        const activeSales = subgraphData?.data?.coinMachinePeriods || [];
        const tokensBoughtEvents = subgraphData?.data?.tokenBoughtEvents || [];
        const transferEvents = subgraphData?.data?.transferEvents || [];
        const historicAvailableTokensEvents = [
          ...tokensBoughtEvents,
          ...transferEvents,
        ]
          .map(parseSubgraphEvent)
          .sort(
            ({ block: lowBlock }, { block: highBlock }) => highBlock - lowBlock,
          );
        /*
         * Generate the starting available tokens value (for the last period)
         * By getting the current available tokens and processing all events
         * that happened in the current, ongoing period
         * (events that are not included in any historic period that we are displaying)
         */
        let lastPeriodAvailableTokens = bigNumberify(
          availableTokens.toString(),
        );
        historicAvailableTokensEvents
          /*
           * Only use events that outside of the latest sale period
           * Earlier events, basically everything that happened in the current
           * "active" sale period
           */
          .filter(
            ({ timestamp: eventTimestamp }) =>
              eventTimestamp > stalePeriods[0].saleEndedAt,
          )
          .map((event) => {
            lastPeriodAvailableTokens = replayBalanceEvents(
              event,
              lastPeriodAvailableTokens,
            );
            return lastPeriodAvailableTokens;
          });

        /*
         * Keep an external counter of the previous price value
         * To help with price evolution calculations
         */
        let previousPrice = bigNumberify(0);
        /*
         * Merge both active and stale periods into one data source
         * This also adds a token availability value, based on replaying the
         * token bought / transfer events
         */
        return (
          stalePeriods
            .map(
              ({
                saleEndedAt: staleSaleEndedAt,
                tokensBought,
                price: stalePrice,
              }) => {
                /*
                 * This is actually equal to the previous period's end time
                 */
                const saleStartedAt =
                  staleSaleEndedAt - periodLength.toNumber();
                /*
                 * Find all the events that happened within this period and
                 * replay them onto the current available tokens.
                 * Since we are going in reverse:
                 * - if tokens were bought we add to to the count
                 * - if tokens were transfered into the coin machine we subtract from the count
                 */
                historicAvailableTokensEvents
                  .filter(
                    ({ timestamp: eventTimestamp }) =>
                      eventTimestamp >= saleStartedAt &&
                      eventTimestamp <= staleSaleEndedAt,
                  )
                  .map((event) => {
                    lastPeriodAvailableTokens = replayBalanceEvents(
                      event,
                      lastPeriodAvailableTokens,
                    );
                    return lastPeriodAvailableTokens;
                  });

                const existingActiveSale = activeSales.find(
                  ({ saleEndedAt: activeSaleEndedAt }) =>
                    activeSaleEndedAt === String(staleSaleEndedAt),
                );
                const tokensAvailable = lastPeriodAvailableTokens.lt(0)
                  ? bigNumberify(0)
                  : lastPeriodAvailableTokens;
                return existingActiveSale
                  ? {
                      saleEndedAt: existingActiveSale.saleEndedAt,
                      tokensBought: existingActiveSale.tokensBought,
                      price: existingActiveSale.price,
                      tokensAvailable: tokensAvailable.toString(),
                    }
                  : {
                      saleEndedAt: String(staleSaleEndedAt),
                      tokensBought: tokensBought.toString(),
                      price: stalePrice.toString(),
                      tokensAvailable: tokensAvailable.toString(),
                    };
              },
            )
            /*
             * Filter out
             * - sale periods that end in the future
             * - sale periods generated for timestamps starting before
             *  the extension was installed
             */
            .filter(
              ({ saleEndedAt }) =>
                parseInt(saleEndedAt, 10) <= currentBlockTime &&
                parseInt(saleEndedAt, 10) >=
                  extensionInitialisedAt.timestamp * 1000,
            )
            /*
             * Price evolution calculations require us to go for oldest sale period
             * to newest and infer the price that way.
             *
             * Currently our array is sorted newest first, because token availablility
             * needs to be calculated in reverse, starting from the current available
             * token supply.
             *
             * I couldn't find a better, and more optimal way of doing this without
             * reversing it, then imediatly after, reversing back
             */
            .reverse()
            /*
             * Calculate price evolution based on the existing active period prices
             */
            .map((period, periodIndex, periodArray) => {
              let currentPrice = bigNumberify(period.price);
              /*
               * Current price is greater than 0, meaning it's already an active
               * period, so we already got the correct price, not need to re-calculate it
               */
              if (bigNumberify(currentPrice).gt(0)) {
                previousPrice = currentPrice;
                return period;
              }

              const previousPeriodTokensBought = periodArray[periodIndex - 1]
                ?.tokensBought
                ? bigNumberify(periodArray[periodIndex - 1]?.tokensBought)
                : bigNumberify(0);

              currentPrice = getCoinMachinePeriodPrice(
                windowSize.toNumber(),
                targetPerPeriod,
                previousPrice,
                previousPeriodTokensBought,
              );

              return {
                ...period,
                price: currentPrice.toString(),
              };
            })
            /*
             * Do a final reverse back to the original order to show the newest
             * ended sale period as the first entry in the table
             */
            .reverse()
        );
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
