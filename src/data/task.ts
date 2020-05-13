import { Resolvers } from 'apollo-client';
import { padLeft, toHex } from 'web3-utils';

import { ContextType } from '~context/index';
import { createAddress } from '~utils/web3';

import { getToken } from './token';
import { EventType } from './index';

export const taskResolvers = ({ colonyManager }: ContextType): Resolvers => ({
  Task: {
    commentCount({ events }): number {
      return events.filter(({ type }) => type === EventType.TaskMessage).length;
    },
    async finalizedPayment({ colonyAddress, finalizedAt, ethPotId }) {
      if (!finalizedAt || !ethPotId) return null;
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      const {
        events: { PayoutClaimed },
      } = colonyClient;
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
