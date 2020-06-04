import { ApolloClient, Resolvers } from 'apollo-client';
import { ClientType, ColonyClient, getLogs } from '@colony/colony-js';

import { Context } from '~context/index';
import { createAddress } from '~utils/web3';
import {
  EventType,
  FinalizeTaskDocument,
  FinalizeTaskMutation,
  FinalizeTaskMutationVariables,
  Task,
} from '~data/index';

import { getToken } from './token';

// @TODO we might want to do this on the server which should monitor events
/*
 * The following is to provide fallback for cases where a user closed the browser before
 * the transaction has been mined.
 *
 * If the task is "pending" (it has a txHash but is not finalized),
 * then look at the recent task payout events&logs and see if any of them matches the
 * task's payout transaction hash.
 *
 * If it does, fire the mutation, set the transaction as "complete".
 */
const finalizeTaskWithTxHash = async (
  colonyClient: ColonyClient,
  apolloClient: ApolloClient<object>,
  id: string,
  txHash: string,
) => {
  const payoutClaimedFilter = colonyClient.filters.PayoutClaimed(
    null,
    null,
    null,
  );
  const payoutClaimedLogs = await getLogs(colonyClient, payoutClaimedFilter);
  const claimedLogForTask = payoutClaimedLogs.find(
    (log) => log.transactionHash === txHash,
  );
  const event = claimedLogForTask
    ? colonyClient.interface.parseLog(claimedLogForTask)
    : undefined;
  const ethPotId = event && event.values.fundingPotId;
  if (ethPotId) {
    // FIXME check roles and send off mutation (FinalizeTaskMutation)
    // then return what it states below (combine!)
    await apolloClient.mutate<
      FinalizeTaskMutation,
      FinalizeTaskMutationVariables
    >({
      mutation: FinalizeTaskDocument,
      variables: {
        input: { id, ethPotId },
      },
    });
    return ethPotId;
  }
  return undefined;
};

export const taskResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Task: {
    commentCount({ events }: Task): number {
      return events.filter(({ type }) => type === EventType.TaskMessage).length;
    },
    async finalizedPayment(
      { colonyAddress, id, finalizedAt, ethPotId, txHash }: Task,
      _,
      { client, ...context },
    ) {
      console.log(context);
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      let existingEthPotId = ethPotId;
      // The task was marked as finalized but is "pending" (only has the tx hash)
      // We try to finalize it properly
      if ((!finalizedAt || !existingEthPotId) && txHash) {
        existingEthPotId = await finalizeTaskWithTxHash(
          colonyClient,
          client,
          id,
          txHash,
        );
      }
      if (existingEthPotId) {
        const payoutClaimedFilter = colonyClient.filters.PayoutClaimed(
          existingEthPotId,
          null,
          null,
        );
        const payoutClaimedLogs = await getLogs(
          colonyClient,
          payoutClaimedFilter,
        );
        const payoutClaimedEvents = payoutClaimedLogs.map((log) =>
          colonyClient.interface.parseLog(log),
        );
        const { associatedTypeId } = await colonyClient.getFundingPot(
          existingEthPotId,
        );
        const { recipient } = await colonyClient.getPayment(associatedTypeId);
        // Get amount and token from first (and probably only) event
        const [
          {
            values: { amount, token },
          },
        ] = payoutClaimedEvents;
        const [{ transactionHash }] = payoutClaimedLogs;
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
      }
      // The task is not finalized yet
      return null;
    },
  },
  TaskPayout: {
    async token({ tokenAddress }, _, { client }) {
      return getToken({ colonyManager, client }, tokenAddress);
    },
  },
});
