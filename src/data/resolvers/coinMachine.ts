import {
  ClientType,
  getLogs,
  getBlockTime,
  CoinMachineClientV2,
  Extension,
  getExtensionHash,
} from '@colony/colony-js';
import { Resolvers } from '@apollo/client';
import { BigNumber, bigNumberify, BigNumberish } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';

import { Context } from '~context/index';
import {
  SubgraphCoinMachinePeriodsQuery,
  SubgraphCoinMachinePeriodsQueryVariables,
  SubgraphCoinMachinePeriodsDocument,
  SubgraphCoinMachineExtensionInstalledQuery,
  SubgraphCoinMachineExtensionInstalledQueryVariables,
  SubgraphCoinMachineExtensionInstalledDocument,
} from '~data/index';
import { createAddress } from '~utils/web3';
import { ExtendedLogDescription, parseSubgraphEvent } from '~utils/events';
import {
  getCoinMachinePeriodPrice,
  getCoinMachinePreDecayPeriodPrice,
} from '~utils/contracts';
import { ColonyAndExtensionsEvents } from '~types/colonyActions';

import { getToken } from './token';

/*
 * Small helper to replay TokensBought / Transfer events over a reversed
 * period array in order to generate a historic available tokens total
 *
 * Since we are going in reverse:
 * - if tokens were bought we add to to the count
 * - if tokens were transfered into the coin machine we subtract from the count
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
        const { blockHash } = await provider.getTransaction(transactionHash);

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
          { blockHash },
        );

        const boughtTokensEvents = await Promise.all(
          boughtTokensLogs.map(async (log) => {
            const parsedLog = coinMachineClient.interface.parseLog(log);
            const { transactionHash: currentLogTransactionHash } = log;
            return {
              ...parsedLog,
              transactionHash: currentLogTransactionHash,
            };
          }),
        );
        const [lastBoughtTokensEvent] = boughtTokensEvents.reverse();

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
          periodLength: periodLengthInMs.toNumber(),
          timeRemaining: timeRemaining.toNumber(),
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

        const tokenBalance = await coinMachineClient.getTokenBalance();

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
          tokenBalance: tokenBalance.toString(),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineTotalTokens(_, { colonyAddress }) {
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );
        const tokenAddress = await coinMachineClient.getToken();
        const tokenClient = await colonyManager.getTokenClient(tokenAddress);

        const currentTokenBalance = await coinMachineClient.getTokenBalance();

        /* eslint-disable no-useless-escape */
        const subgraphData = await apolloClient.query<
          SubgraphCoinMachineExtensionInstalledQuery,
          SubgraphCoinMachineExtensionInstalledQueryVariables
        >({
          query: SubgraphCoinMachineExtensionInstalledDocument,
          variables: {
            /*
             * @NOTE This is required since we have to filter by both extension
             * name and colony address within the events arguments
             *
             * It's not pretty and sadly we don't have a better solution
             */
            argumentsFilter: `\"extensionId\":\"${getExtensionHash(
              Extension.CoinMachine,
            )}\",\"colony\":\"${colonyAddress.toLowerCase()}\"`,
          },
          fetchPolicy: 'network-only',
        });
        /* eslint-enable no-useless-escape */

        const [extensionInstalled] = (
          subgraphData?.data?.extensionInstalledEvents || []
        ).map(parseSubgraphEvent);

        /*
         * We use the `FromChain` suffix to make these events more easily
         * recognizable when reading the code
         */
        const transferLogsFromChain = await getLogs(
          tokenClient,
          tokenClient.filters.Transfer(null, coinMachineClient.address, null),
          {
            fromBlock: extensionInstalled?.blockNumber,
          },
        );

        const transferEventsFromChain = await Promise.all(
          transferLogsFromChain.map(async (log) =>
            tokenClient.interface.parseLog(log),
          ),
        );
        const totalAvailableTokens = transferEventsFromChain.reduce(
          (acc, event) => event.values[2].add(acc),
          '0',
        );

        return {
          totalAvailableTokens: totalAvailableTokens.toString(),
          totalSoldTokens: totalAvailableTokens
            .sub(currentTokenBalance)
            .toString(),
        };
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
        const { networkClient, provider } = colonyManager;
        const coinMachineClient = (await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        )) as CoinMachineClientV2;

        const currentBlock = await networkClient.provider.getBlock('latest');
        const currentBlockTime = currentBlock.timestamp * 1000;

        const tokenAddress = await coinMachineClient.getToken();
        const tokenClient = await colonyManager.getTokenClient(tokenAddress);

        /* eslint-disable no-useless-escape */
        const extensionData = await apolloClient.query<
          SubgraphCoinMachineExtensionInstalledQuery,
          SubgraphCoinMachineExtensionInstalledQueryVariables
        >({
          query: SubgraphCoinMachineExtensionInstalledDocument,
          variables: {
            /*
             * @NOTE This is required since we have to filter by both extension
             * name and colony address within the events arguments
             *
             * It's not pretty and sadly we don't have a better solution
             */
            argumentsFilter: `\"extensionId\":\"${getExtensionHash(
              Extension.CoinMachine,
            )}\",\"colony\":\"${colonyAddress.toLowerCase()}\"`,
          },
          fetchPolicy: 'network-only',
        });
        /* eslint-enable no-useless-escape */

        const [extensionInstalled] = (
          extensionData?.data?.extensionInstalledEvents || []
        ).map(parseSubgraphEvent);

        const subgraphData = await apolloClient.query<
          SubgraphCoinMachinePeriodsQuery,
          SubgraphCoinMachinePeriodsQueryVariables
        >({
          query: SubgraphCoinMachinePeriodsDocument,
          variables: {
            colonyAddress: colonyAddress.toLowerCase(),
            extensionAddress: coinMachineClient.address.toLowerCase(),
            periodsCreatedAfter: String(
              extensionInstalled?.timestamp || currentBlockTime,
            ),
            sortDirection: 'desc',
            limit,
          },
          fetchPolicy: 'network-only',
        });

        /*
         * We use the `FromChain` suffix to make these events more easily
         * recognizable when reading the code
         */
        const transferLogsFromChain = await getLogs(
          tokenClient,
          tokenClient.filters.Transfer(null, coinMachineClient.address, null),
          {
            fromBlock: extensionInstalled?.blockNumber,
          },
        );
        /*
         * Format the `Transfer` events so they resemble events fetched
         * from the subgraph
         * This way we can more easily combine them
         */
        const transferEventsFromChain = await Promise.all(
          transferLogsFromChain.map(async (log) => ({
            ...tokenClient.interface.parseLog(log),
            timestamp: await getBlockTime(provider, log.blockHash || ''),
            index: `${log.blockNumber}${String(log.logIndex).padStart(7, '0')}`,
          })),
        );

        const periodLength = (await coinMachineClient.getPeriodLength()).mul(
          1000,
        );
        const availableTokens = await coinMachineClient.getTokenBalance();
        const targetPerPeriod = await coinMachineClient.getTargetPerPeriod();
        const windowSize = await coinMachineClient.getWindowSize();
        const currentPeriodPrice = await coinMachineClient.getCurrentPrice();

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
        const historicAvailableTokensEvents = tokensBoughtEvents
          .map(parseSubgraphEvent)
          .concat(
            (transferEventsFromChain as unknown) as ExtendedLogDescription,
          )
          .reverse();
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
           * Only use events that are outside of the latest sale period.
           * Earlier events, basically everything that happened in the current
           * "active" sale period
           */
          .filter(
            ({ timestamp: eventTimestamp = 0 }) =>
              eventTimestamp >= stalePeriods[0].saleEndedAt,
          )
          .map((event) => {
            lastPeriodAvailableTokens = replayBalanceEvents(
              event,
              lastPeriodAvailableTokens,
            );
            return lastPeriodAvailableTokens;
          });
        /*
         * Get the first ever Transfer token even (the one that added the initial
         * tokens to the Coin Machine)
         *
         * We use as a fallback if there is a sale in the first period that the
         * transfer also happened
         */
        const firstTokenTransfer = historicAvailableTokensEvents
          .reverse()
          .find(({ name }) => name === ColonyAndExtensionsEvents.Transfer);

        /*
         * Keep an external counter of the previous price value
         * To help with price evolution calculations
         */
        let previousPrice = bigNumberify(0);
        let nextPrice = bigNumberify(0);
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
                 */
                historicAvailableTokensEvents
                  .filter(
                    ({ timestamp: eventTimestamp = 0 }) =>
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
                const tokensAvailable = lastPeriodAvailableTokens.lte(0)
                  ? bigNumberify(0)
                  : lastPeriodAvailableTokens;

                const periodTokensBought =
                  existingActiveSale?.tokensBought || tokensBought.toString();
                /*
                 * If there's a sale in the same period as there was the first
                 * token transfer into Coin Machine, make sure to fetch that
                 * value first and display it _(and not wait for the `replayBalanceEvents` logic)_
                 *
                 * This way we cover the edge case for a first sale in the same period
                 * as tokens coming, to prevent showing something like 1000/0 tokens bought
                 */
                const tokensAvailableWithFallback =
                  bigNumberify(periodTokensBought).gt(tokensAvailable) &&
                  tokensAvailable.lte(0)
                    ? firstTokenTransfer?.values?.wad || bigNumberify(0)
                    : tokensAvailable;

                return existingActiveSale
                  ? {
                      saleEndedAt: existingActiveSale.saleEndedAt,
                      tokensBought: periodTokensBought,
                      price: existingActiveSale.price,
                      tokensAvailable: tokensAvailableWithFallback.toString(),
                    }
                  : {
                      saleEndedAt: String(staleSaleEndedAt),
                      tokensBought: periodTokensBought,
                      price: stalePrice.toString(),
                      tokensAvailable: tokensAvailableWithFallback.toString(),
                    };
              },
            )
            /*
             * Filter out
             * - periods with 0 available tokens (coin machine is out of tokens)
             * - sale periods that end in the future
             * - sale periods generated for timestamps starting before
             *  the extension was installed
             */
            .filter(
              ({ saleEndedAt, tokensAvailable }) =>
                parseInt(saleEndedAt, 10) <= currentBlockTime &&
                parseInt(saleEndedAt, 10) >=
                  (extensionInstalled.timestamp || 1000) &&
                bigNumberify(tokensAvailable).gt(0),
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
              // Skip first periods, until we find a period with a sale and we know a historical price

              let currentPrice = bigNumberify(period.price);
              if (currentPrice.eq(0) && previousPrice.eq(0)) {
                return period;
              }

              /*
               * Current price is greater than 0, meaning it's already an active
               * period, so we already got the correct price, no need to re-calculate it
               * Set previous price to this value.
               */
              if (currentPrice.gt(0)) {
                previousPrice = currentPrice;
                return period;
              }

              /*
               * If there are no more tokens in the coin machine, the price doesn't
               * evolve anymore
               * Previous price remains the same
               */
              if (bigNumberify(period.tokensAvailable).isZero()) {
                return {
                  ...period,
                  price: previousPrice.toString(),
                };
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

              previousPrice = currentPrice;

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
            /* We now run through the array again, and will fill in the price for periods before the first
             * token was sold.
             */
            .map((period, index) => {
              // Skip periods with known price
              let currentPrice = bigNumberify(period.price);
              /*
               * @TODO While this works, we need the initial price that Coin Machine started with,
               * and not the current coin machine prioce
               */
              if (currentPrice.isZero() && index === 0) {
                nextPrice = getCoinMachinePreDecayPeriodPrice(
                  windowSize.toNumber(),
                  currentPeriodPrice,
                );
                return {
                  ...period,
                  price: nextPrice.toString(),
                };
              }
              if (currentPrice.gt(0)) {
                nextPrice = currentPrice;
                return period;
              }

              /*
               * If there are no more tokens in the coin machine, the price doesn't
               * evolve anymore
               * Nextprice remains the same
               */
              if (bigNumberify(period.tokensAvailable).isZero()) {
                return {
                  ...period,
                  price: nextPrice.toString(),
                };
              }

              /* The price in this period is the one that decays to nextPrice if
               * no tokens are bought
               */
              currentPrice = getCoinMachinePreDecayPeriodPrice(
                windowSize.toNumber(),
                nextPrice,
              );

              nextPrice = currentPrice;

              return {
                ...period,
                price: currentPrice.toString(),
              };
            })
        );
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async coinMachineHasWhitelist(_, { colonyAddress }) {
      try {
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );
        const coinMachineWhitelist = await coinMachineClient.getWhitelist();
        return coinMachineWhitelist !== AddressZero;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
});
