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

import { getToken } from './token';

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
    async coinMachineSalePeriods(_, { colonyAddress, limit }) {
      console.log('<--- fetching periods ---->');
      try {
        const activeSalesData = await apolloClient.query<
          SubgraphCoinMachinePeriodsQuery,
          SubgraphCoinMachinePeriodsQueryVariables
        >({
          query: SubgraphCoinMachinePeriodsDocument,
          variables: {
            colonyAddress: colonyAddress.toLowerCase(),
          },
          fetchPolicy: 'network-only',
        });

        const { networkClient } = colonyManager;
        const coinMachineClient = (await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        )) as CoinMachineClientV2;
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );

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
        const blockPeriod =
          (await getAverageBlockPeriod(
            networkClient.provider,
            'latest',
            extensionInitialisedLogs[0].blockNumber,
          )) || 1000;
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
        const blockNumberForOldestPeriod = Math.floor(
          currentBlock.number - (limit * periodLength.toNumber()) / blockPeriod,
        );
        const blockNumberForOldestPeriodNormalized =
          blockNumberForOldestPeriod <= extensionInitialisedAt.number
            ? extensionInitialisedAt.number
            : blockNumberForOldestPeriod;
        // console.log(
        //   'BLOCK TO START LOOKING FOR EVENTS',
        //   blockNumberForOldestPeriod,
        //   'normalized',
        //   blockNumberForOldestPeriodNormalized,
        // );

        /*
         * Fetch Coin Machine TokensBought, both logs and events and merge them into a single object
         */
        const coinMachineTokenBoughtEvents = (
          await getLogs(
            coinMachineClient,
            coinMachineClient.filters.TokensBought(null, null, null),
            {
              fromBlock: blockNumberForOldestPeriodNormalized,
              toBlock: currentBlock.number,
            },
          )
        )
          .reverse()
          .map((log) => ({
            ...log,
            ...coinMachineClient.interface.parseLog(log),
          }));
        /*
         * Fetch Token Client Transfer, both logs and events and merge them into a single object
         */
        const coinMachineFundedEvents = (
          await getLogs(
            colonyClient.tokenClient,
            colonyClient.tokenClient.filters.Transfer(
              null,
              coinMachineClient.address,
              null,
            ),
            {
              fromBlock: blockNumberForOldestPeriodNormalized,
              toBlock: currentBlock.number,
            },
          )
        )
          .reverse()
          .map((log) => ({
            ...log,
            ...colonyClient.tokenClient.interface.parseLog(log),
          }));
        // console.log(
        //   'EVENTS',
        //   coinMachineTokenBoughtEvents,
        //   coinMachineFundedEvents,
        // );

        /*
         * Reconstruct a token history walking back block numbers
         * This also aproximates the block timestamp by using the block period
         * we've gotten earlier
         */
        const reconstructedTokenAvailability = [
          {
            number: currentBlock.number,
            timestamp: currentBlockTime,
            availableTokens: bigNumberify(availableTokens.toString()),
          },
        ];
        for (
          let index = currentBlock.number - 1;
          index >= blockNumberForOldestPeriodNormalized;
          index -= 1
        ) {
          const {
            timestamp: prevTimestamp,
            availableTokens: prevAvailableTokens,
          } = reconstructedTokenAvailability.find(
            ({ number: blockNumber }) => blockNumber === index + 1,
          ) || {
            timestamp: 0,
            availableTokens: bigNumberify(0),
          };
          let currentAvailableTokens = prevAvailableTokens;
          /*
           * Walk back events and reconcile them
           */
          coinMachineFundedEvents
            .concat(coinMachineTokenBoughtEvents)
            /*
             * Find all events that match this block number (both TokensBought and Transfer)
             * We're basically using this as an findAll() if that were a thing...
             */
            .filter(
              ({ blockNumber: eventBlockNumber }) => eventBlockNumber === index,
            )
            /*
             * Based on the found events, do local token accounting. Since we are going in reverse:
             * - Transfers will remove tokens
             * - TokensBought will add them
             */
            .map(({ name, values }) => {
              if (name === 'Transfer') {
                currentAvailableTokens = currentAvailableTokens.sub(
                  bigNumberify(values.wad.toString()),
                );
              }
              if (name === 'TokensBought') {
                currentAvailableTokens = currentAvailableTokens.add(
                  bigNumberify(values.numTokens.toString()),
                );
              }
              return null;
            });
          reconstructedTokenAvailability.push({
            number: index,
            timestamp: prevTimestamp - blockPeriod,
            availableTokens: currentAvailableTokens.lt(0)
              ? bigNumberify(0)
              : currentAvailableTokens,
          });
        }

        // console.log('TOKEN AVAILABILITY', reconstructedTokenAvailability);

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

        const activeSales = activeSalesData?.data?.coinMachinePeriods || [];
        /*
         * Merge both active and stale periods into one data source
         * This also adds a token availability value, based on the nearest block
         * from the approximated token availability history array
         */
        const aggregatedPeriods = stalePeriods
          .map((staleSale) => {
            const {
              saleEndedAt: staleSaleEndedAt,
              tokensBought,
              price: stalePrice,
            } = staleSale;
            const existingActiveSale = activeSales.find(
              ({ saleEndedAt: activeSaleEndedAt }) =>
                activeSaleEndedAt === String(staleSaleEndedAt),
            );
            const nearestBlockTokenInfo = reconstructedTokenAvailability.find(
              ({ timestamp: nearestTimestamp }) =>
                staleSaleEndedAt >= nearestTimestamp,
            );
            return existingActiveSale
              ? {
                  saleEndedAt: existingActiveSale.saleEndedAt,
                  tokensBought: existingActiveSale.tokensBought,
                  price: existingActiveSale.price,
                  tokensAvailable: nearestBlockTokenInfo
                    ? nearestBlockTokenInfo.availableTokens.toString()
                    : bigNumberify(availableTokens.toString()).toString(),
                }
              : {
                  ...staleSale,
                  saleEndedAt: String(staleSaleEndedAt),
                  tokensBought: tokensBought.toString(),
                  price: stalePrice.toString(),
                  tokensAvailable: nearestBlockTokenInfo
                    ? nearestBlockTokenInfo.availableTokens.toString()
                    : bigNumberify(0).toString(),
                };
          })
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

        // console.log('ACTIVE', activeSalesData?.data?.coinMachinePeriods || []);
        // console.log('STALE', stalePeriods);
        console.log('ALL', aggregatedPeriods);

        console.log('<--- fetched new periods ---->');
        return aggregatedPeriods;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
