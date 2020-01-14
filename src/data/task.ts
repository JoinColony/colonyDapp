import { Resolvers } from 'apollo-client';
import { padLeft, toHex } from 'web3-utils';

import { ContextType } from '~context/index';

export const taskResolvers = ({ colonyManager }: ContextType): Resolvers => ({
  Task: {
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
        colonyClient.getFundingPot.call({
          potId: ethPotId,
        }),
      ]);
      if (!logs || !logs.length) return null;
      const events = colonyClient.parseLogs(logs);
      if (!events || !events.length || !fundingPot) return null;
      const payment = await colonyClient.getPayment.call({
        paymentId: fundingPot.typeId,
      });
      const [{ amount, token }] = events;
      const { recipient } = payment;
      const [{ transactionHash }] = logs;
      return {
        __typename: 'TaskFinalizedPayment',
        amount: amount.toString(),
        tokenAddress: token,
        workerAddress: recipient,
        transactionHash,
      };
    },
  },
});
