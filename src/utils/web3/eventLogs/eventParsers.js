/* @flow */

import BigNumber from 'bn.js';

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { ContractTransactionType } from '~immutable';

/**
 * Given an event log and ColonyClient, get the timestamp of the block from
 * which it was emitted and return as a JS Date.
 */
export const getLogDate = async ({
  log: { blockHash },
  colonyClient: {
    adapter: { provider },
  },
}: {
  log: Object,
  colonyClient: ColonyClientType,
}) => {
  const { timestamp } = await provider.getBlock(blockHash);
  return new Date(timestamp);
};

/**
 * Given a ColonyJS-parsed ColonyFundsClaimedEvent, log from which it was
 * parsed, ColonyClient and colonyENSName, return a ContractTransactionType
 * object, or null if the claim amount was zero.
 */
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
  colonyClient: ColonyClientType,
  colonyENSName: string,
}): Promise<?ContractTransactionType> => {
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

/**
 * Given a ColonyJS-parsed ColonyFundsMovedBetweenFundingPotsEvent, log from
 * which it was parsed, ColonyClient and colonyENSName, return a
 * ContractTransactionType object.
 */
export const parseColonyFundsMovedBetweenFundingPotsEvent = async ({
  event,
  log,
  colonyClient,
  colonyENSName,
}: {
  event: Object,
  log: Object,
  colonyClient: ColonyClientType,
  colonyENSName: string,
}): Promise<ContractTransactionType> => {
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

/**
 * Given a ColonyJS-parsed TaskPayoutClaimedEvent, log from which it was
 * parsed, and ColonyClient, return a ContractTransactionType object.
 */
export const parseTaskPayoutClaimedEvent = async ({
  event,
  log,
  colonyClient,
}: {
  event: Object,
  log: Object,
  colonyClient: ColonyClientType,
}): Promise<ContractTransactionType> => {
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

/**
 * Given a ColonyJS-parsed TransferEvent, log from which it was parsed, Array
 * of Colony token claim events and associated logs from which they were
 * passed, ColonyClient, and colonyENSName, return a ContractTransactionType
 * object or null if that token has been claimed since the Transfer.
 */
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
  colonyClient: ColonyClientType,
  colonyENSName: string,
}): Promise<?ContractTransactionType> => {
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

/**
 * Given a ColonyJS-parsed TransferEvent for a user, the log from which it was
 * parsed, ColonyClient, and userAddress, return a ContractTransactionType
 * object for the token transfer.
 */
export const parseUserTransferEvent = async ({
  event,
  log,
  colonyClient,
  userAddress,
}: {
  event: Object,
  log: Object,
  colonyClient: ColonyClientType,
  userAddress: string,
}): Promise<ContractTransactionType> => {
  const { to, from, tokens: amount } = event;
  const { address: token, transactionHash: hash } = log;
  const date = await getLogDate({ log, colonyClient });

  return {
    amount,
    date,
    from,
    hash,
    id: hash,
    incoming: to.toLowerCase() === userAddress.toLowerCase(),
    to,
    token,
  };
};
