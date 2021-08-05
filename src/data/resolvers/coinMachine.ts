import { ClientType, getBlockTime } from '@colony/colony-js';
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
  },
});
