import {
  ClientType,
  getLogs,
  getBlockTime,
  CoinMachineClientV2,
  getEvents,
} from '@colony/colony-js';
import { Resolvers } from '@apollo/client';
import { BigNumber, bigNumberify, BigNumberish } from 'ethers/utils';

import { Context } from '~context/index';
import {
  SubgraphCoinMachinePeriodsQuery,
  SubgraphCoinMachinePeriodsQueryVariables,
  SubgraphCoinMachinePeriodsDocument,
} from '~data/index';
import { createAddress, getAverageBlockPeriod } from '~utils/web3';
import { parseSubgraphEvent } from '~utils/events';

import { getToken } from './token';

/*
 * Small helper to replay TokensBought / Transfer events over a reversed
 * period array in order to generate a historic available tokens total
 *
 * @TODO Add enum types for the Event names
 */
const replayBalanceEvents = (
  {
    name,
    values,
  }: { name: string; values: { wad: BigNumber; numTokens: BigNumber } },
  total: BigNumber,
): BigNumber => {
  let aggregator = total;
  if (name === 'Transfer') {
    // eslint-disable-next-line no-param-reassign
    aggregator = aggregator.sub(bigNumberify(values.wad.toString()));
  }
  if (name === 'TokensBought') {
    // console.log('added', agreggator.toString(), bigNumberify(values.numTokens).div(bigNumberify(10).pow(18)).toString());
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unused-vars
    aggregator = aggregator.add(bigNumberify(values.numTokens.toString()));
    // console.log('after adding', agreggator, agreggator.toString())
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
      console.log('<--- fetching periods ---->');
      try {
        const { networkClient } = colonyManager;
        const coinMachineClient = (await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        )) as CoinMachineClientV2;
        // const colonyClient = await colonyManager.getClient(
        //   ClientType.ColonyClient,
        //   colonyAddress,
        // );

        const subgraphData = await apolloClient.query<
          SubgraphCoinMachinePeriodsQuery,
          SubgraphCoinMachinePeriodsQueryVariables
        >({
          query: SubgraphCoinMachinePeriodsDocument,
          variables: {
            colonyAddress: colonyAddress.toLowerCase(),
            extensionAddress: coinMachineClient.address.toLowerCase(),
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
        // const blockPeriod =
        //   (await getAverageBlockPeriod(
        //     networkClient.provider,
        //     'latest',
        //     extensionInitialisedLogs[0].blockNumber,
        //   )) || 1000;
        const currentBlock = await networkClient.provider.getBlock('latest');
        const currentBlockTime = currentBlock.timestamp * 1000;

        console.log('CURRENT BLOCK', currentBlock.number, currentBlock);
        // console.log('CURRENT BLOCK TIME', currentBlockTime);
        // console.log('PERIOD LENGTH', periodLength.toNumber());
        // console.log('BLOCK PERIOD', blockPeriod);

        /*
         * @TODO List
         * -
         */

        let latestPeriodStart = currentBlockTime;
        while (latestPeriodStart % periodLength.toNumber() !== 0) {
          latestPeriodStart -= 1000;
        }
        let latestPeriodEnd = latestPeriodStart;

        /*
         * @NOTE This is an approximation
         */
        // const blockNumberForOldestPeriod = Math.floor(
        //   currentBlock.number - (limit * periodLength.toNumber()) / blockPeriod,
        // );
        // const blockNumberForOldestPeriodNormalized =
        //   blockNumberForOldestPeriod <= extensionInitialisedAt.number
        //     ? extensionInitialisedAt.number
        //     : blockNumberForOldestPeriod;
        // console.log(
        //   'BLOCK TO START LOOKING FOR EVENTS',
        //   blockNumberForOldestPeriod,
        //   'normalized',
        //   blockNumberForOldestPeriodNormalized,
        // );

        /*
         * Fetch Coin Machine TokensBought, both logs and events and merge them into a single object
         */
        // const coinMachineTokenBoughtEvents = (
        //   await getLogs(
        //     coinMachineClient,
        //     coinMachineClient.filters.TokensBought(null, null, null),
        //     // {
        //     //   fromBlock: blockNumberForOldestPeriodNormalized,
        //     //   toBlock: currentBlock.number,
        //     // },
        //   )
        // )
        //   .reverse()
        //   .map((log) => ({
        //     ...log,
        //     ...coinMachineClient.interface.parseLog(log),
        //   }));
        /*
         * Fetch Token Client Transfer, both logs and events and merge them into a single object
         */
        // const coinMachineFundedEvents = (
        //   await getLogs(
        //     colonyClient.tokenClient,
        //     colonyClient.tokenClient.filters.Transfer(
        //       null,
        //       coinMachineClient.address,
        //       null,
        //     ),
        //     {
        //       fromBlock: blockNumberForOldestPeriodNormalized,
        //       toBlock: currentBlock.number,
        //     },
        //   )
        // )
        //   .reverse()
        //   .map((log) => ({
        //     ...log,
        //     ...colonyClient.tokenClient.interface.parseLog(log),
        //   }));
        // console.log(
        //   'EVENTS',
        //   coinMachineTokenBoughtEvents,
        //   // coinMachineFundedEvents,
        // );

        // await Promise.all(coinMachineTokenBoughtEvents.concat(coinMachineFundedEvents).map(async ({ blockNumber, name }) => {
        //   const block = await networkClient.provider.getBlock(blockNumber || 'latest');
        //   console.log(block.number, block.timestamp * 1000, name);
        // }));

        /*
         * Reconstruct a token history walking back block numbers
         * This also aproximates the block timestamp by using the block period
         * we've gotten earlier
         */
        // const reconstructedTokenAvailability = [
        //   {
        //     number: currentBlock.number,
        //     timestamp: currentBlockTime,
        //     availableTokens: bigNumberify(availableTokens.toString()),
        //   },
        // ];
        // for (
        //   let index = currentBlock.number - 1;
        //   index >= blockNumberForOldestPeriodNormalized;
        //   index -= 1
        // ) {
        //   const {
        //     timestamp: prevTimestamp,
        //     availableTokens: prevAvailableTokens,
        //   } = reconstructedTokenAvailability.find(
        //     ({ number: blockNumber }) => blockNumber === index + 1,
        //   ) || {
        //     timestamp: 0,
        //     availableTokens: bigNumberify(0),
        //   };
        //   let currentAvailableTokens = prevAvailableTokens;
        //   /*
        //    * Walk back events and reconcile them
        //    */
        //   coinMachineFundedEvents
        //     .concat(coinMachineTokenBoughtEvents)
        //     /*
        //      * Find all events that match this block number (both TokensBought and Transfer)
        //      * We're basically using this as an findAll() if that were a thing...
        //      */
        //     .filter(
        //       ({ blockNumber: eventBlockNumber }) => eventBlockNumber === index,
        //     )
        //     /*
        //      * Based on the found events, do local token accounting. Since we are going in reverse:
        //      * - Transfers will remove tokens
        //      * - TokensBought will add them
        //      */
        //     .map(({ name, values }) => {
        //       if (name === 'Transfer') {
        //         currentAvailableTokens = currentAvailableTokens.sub(
        //           bigNumberify(values.wad.toString()),
        //         );
        //       }
        //       if (name === 'TokensBought') {
        //         currentAvailableTokens = currentAvailableTokens.add(
        //           bigNumberify(values.numTokens.toString()),
        //         );
        //       }
        //       return null;
        //     });
        //   reconstructedTokenAvailability.push({
        //     number: index,
        //     timestamp: prevTimestamp - blockPeriod,
        //     availableTokens: currentAvailableTokens.lt(0)
        //       ? bigNumberify(0)
        //       : currentAvailableTokens,
        //   });
        // }

        // console.log('TOKEN AVAILABILITY', reconstructedTokenAvailability.map(log => ({ ...log, hr: log.availableTokens.toString()})));

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
        // console.log('SUBGRAPH EVENTS', historicAvailableTokensEvents);

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
        // console.log(
        //   'EVENTS TO FILTER OUT INITIALLY',
        //   historicAvailableTokensEvents.filter(
        //     ({ timestamp: eventTimestamp }) =>
        //       eventTimestamp > stalePeriods[0].saleEndedAt,
        //   ),
        // );
        // console.log('INITIAL AVAILABLE TKNS', availableTokens.toString());
        // console.log(
        //   'LAST PERIOOD AVAILABLE TKNS',
        //   lastPeriodAvailableTokens.toString(),
        // );
        /*
         * Merge both active and stale periods into one data source
         * This also adds a token availability value, based on replaying the
         * token bought / transfer events
         */
        const aggregatedPeriods = stalePeriods
          .map(
            ({
              saleEndedAt: staleSaleEndedAt,
              tokensBought,
              price: stalePrice,
            }) => {
              /*
               * This is actually equal to the previous period's end time
               */
              const saleStartedAt = staleSaleEndedAt - periodLength.toNumber();
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

              // const nearestBlockTokenInfo = reconstructedTokenAvailability.find(
              //   ({ timestamp: nearestTimestamp }) =>
              //     staleSaleEndedAt >= nearestTimestamp,
              // );
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
          );

        // console.log('ACTIVE', subgraphData?.data?.coinMachinePeriods || []);
        // console.log('STALE', stalePeriods);
        console.log('ALL', aggregatedPeriods);
        // console.log(
        //   'ALL',
        //   aggregatedPeriods.map(({ saleEndedAt }) => {
        //     const saleEnd = parseInt(saleEndedAt, 10);
        //     const saleStart = saleEnd - periodLength.toNumber();
        //     const eventsInPeriod = historicAvailableTokensEvents.filter(
        //       ({ timestamp: ttt }) => ttt >= saleStart && ttt <= saleEnd,
        //     );
        //     return {
        //       saleStart,
        //       saleEnd,
        //       events: eventsInPeriod.map(({ block }) => block),
        //     };
        //   }),
        // );

        console.log('<--- fetched new periods ---->');
        return aggregatedPeriods;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
