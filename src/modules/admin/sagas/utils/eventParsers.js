/* @flow */

import BigNumber from 'bn.js';

import type { ColonyClient } from '@colony/colony-js-client';

export const getLogDate = async ({
  log: { blockHash },
  colonyClient: {
    adapter: { provider },
  },
}: {
  log: Object,
  colonyClient: ColonyClient,
}) => {
  const { timestamp } = await provider.getBlock(blockHash);
  return new Date(timestamp);
};

export const parseColonyFundsClaimedEvent = async ({
  event,
  log,
  colonyClient,
  colonyClient: {
    adapter: { provider },
  },
  colonyENSName,
}: {
  event: Object,
  log: Object,
  colonyClient: ColonyClient,
  colonyENSName: string,
}) => {
  const { payoutRemainder: amount, token } = event;
  const { transactionHash } = log;
  const date = await getLogDate({ log, colonyClient });
  const { from } = await provider.getTransaction(transactionHash);

  // don't show claims of zero
  return amount.gt(new BigNumber(0))
    ? {
        amount,
        colonyENSName,
        date,
        from,
        id: transactionHash,
        incoming: true,
        token,
        hash: transactionHash,
      }
    : null;
};

export const parseColonyFundsMovedBetweenFundingPotsEvent = async ({
  event,
  log,
  colonyClient,
  colonyENSName,
}: {
  event: Object,
  log: Object,
  colonyClient: ColonyClient,
  colonyENSName: string,
}) => {
  const { amount, fromPot, token } = event;
  const { transactionHash } = log;
  const date = await getLogDate({ log, colonyClient });

  // TODO: replace this once able to get taskId from potId
  const taskId = 1;
  // const [, taskId] = yield call(
  //   [colonyClient.contract, colonyClient.contract.pots],
  //   events[i].fromPot === 1 ? events[i].toPot : events[i].fromPot,
  // );

  return {
    amount,
    colonyENSName,
    date,
    id: transactionHash,
    incoming: fromPot !== 1,
    taskId,
    token,
    hash: transactionHash,
  };
};

export const parseTaskPayoutClaimedEvent = async ({
  event,
  log,
  colonyClient,
}: {
  event: Object,
  log: Object,
  colonyClient: ColonyClient,
}) => {
  const { taskId, role, amount, token } = event;
  const { transactionHash } = log;
  const date = await getLogDate({ log, colonyClient });

  const { address: to } = await colonyClient.getTaskRole.call({ taskId, role });
  return {
    amount,
    date,
    id: transactionHash,
    incoming: false,
    taskId,
    to,
    token,
    hash: transactionHash,
  };
};

export const parseUnclaimedTransferEvent = async ({
  transferEvent,
  transferLog,
  claimEvents,
  claimLogs,
  colonyClient,
  colonyENSName,
}: {
  transferEvent: Object,
  transferLog: Object,
  claimEvents: Array<Object>,
  claimLogs: Array<Object>,
  colonyClient: ColonyClient,
  colonyENSName: string,
}) => {
  const { from, tokens: amount } = transferEvent;
  const { address: token, blockNumber, transactionHash: hash } = transferLog;
  const date = await getLogDate({ log: transferLog, colonyClient });

  // Only return if we haven't claimed since it happened
  return claimEvents.find(
    (claimEvent, j) =>
      claimEvent.token.toLowerCase() === token.toLowerCase() &&
      claimLogs[j].blockNumber > blockNumber,
  )
    ? null
    : {
        amount,
        colonyENSName,
        date,
        from,
        hash,
        id: hash,
        incoming: true,
        token,
      };
};
