import { Resolvers } from 'apollo-client';
import { ClientType } from '@colony/colony-js';

import { Context } from '~context/index';
import { createAddress, padLeft, toHex } from '~utils/web3';

import { getToken } from './token';
import { EventType } from './index';

export const taskResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Task: {
    commentCount({ events }): number {
      return events.filter(({ type }) => type === EventType.TaskMessage).length;
    },
    async finalizedPayment({ colonyAddress, finalizedAt, ethPotId }) {
      if (!finalizedAt || !ethPotId) return null;
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      const {
        events: { PayoutClaimed },
      } = colonyClient;
      // FIXME this won't work
      // Idea: remove the any type from ethers contract temporarily and fix everything
      const topics = [
        ...PayoutClaimed.interface.topics,
        padLeft(toHex(ethPotId), 64),
      ];
      const [logs, fundingPot] = await Promise.all([
        colonyClient.getLogs({
          fromBlock: 1,
          toBlock: 'latest',
          address: colonyAddress,
          topics,
        }),
        colonyClient.getFundingPot(ethPotId),
      ]);
      if (!logs || !logs.length) return null;
      const events = colonyClient.parseLogs(logs);
      if (!events || !events.length || !fundingPot) return null;
      const payment = await colonyClient.getPayment(
        fundingPot.associatedTypeId,
      );
      const [{ amount, token }] = events;
      const { recipient } = payment;
      const [{ transactionHash }] = logs;
      return {
        __typename: 'TaskFinalizedPayment',
        amount: amount.toString(),
        /*
         * @NOTE Checksum the token address coming from logs / events
         */
        tokenAddress: createAddress(token),
        workerAddress: recipient,
        transactionHash,
      };
    },
  },
  TaskPayout: {
    async token({ tokenAddress }, _, { client }) {
      return getToken({ colonyManager, client }, tokenAddress);
    },
  },
});
