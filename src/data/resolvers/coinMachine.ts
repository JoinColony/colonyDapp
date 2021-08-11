import { ClientType, getLogs, getBlockTime } from '@colony/colony-js';
import { Resolvers } from '@apollo/client';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';
import { createAddress } from '~utils/web3';

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
    async coinMachineSalePeriod(_, { colonyAddress }) {
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
    async coinMachineTokenSales(_, { colonyAddress }) {
      try {
        const { networkClient } = colonyManager;
        const coinMachineClient = await colonyManager.getClient(
          ClientType.CoinMachineClient,
          colonyAddress,
        );

        const periodLength = await coinMachineClient.getPeriodLength();
        const blockTime = await getBlockTime(networkClient.provider, 'latest');
        const periodLengthInMs = periodLength.mul(1000);
        const latestSalePeriodRemainder = bigNumberify(blockTime).mod(
          periodLengthInMs,
        );
        const latestSalePeriodEnd = bigNumberify(blockTime).sub(
          latestSalePeriodRemainder,
        );
        const tokensBoughtLogs = await getLogs(
          coinMachineClient,
          coinMachineClient.filters.TokensBought(null, null, null),
        );

        const parsedTokensBoughtEvents = await Promise.all(
          tokensBoughtLogs.map(async (log) => {
            const parsedLog = coinMachineClient.interface.parseLog(log);
            const { blockHash } = log;
            const { values } = parsedLog;
            return {
              createdAt: blockHash
                ? await getBlockTime(coinMachineClient.provider, blockHash)
                : 0,
              numTokens: values.numTokens?.toString() || '0',
              totalCost: values.totalCost?.toString() || '0',
            };
          }),
        );

        const previousSales: {
          saleEndedAt: string;
          tokensBought: {
            createdAt: number;
            numTokens: string;
            totalCost: string;
          }[];
        }[] = [];
        for (let i = 0; i < 6; i += 1) {
          const saleEndedAt = latestSalePeriodEnd.sub(periodLengthInMs.mul(i));
          const previousSaleEndedAt = latestSalePeriodEnd.sub(
            periodLengthInMs.mul(i + 1),
          );
          previousSales.push({
            saleEndedAt: saleEndedAt.toString(),
            tokensBought: parsedTokensBoughtEvents.filter(
              (event) =>
                saleEndedAt.gt(event.createdAt) &&
                previousSaleEndedAt.lt(event.createdAt),
            ),
          });
        }

        return previousSales;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});
