/* @flow */

import type {
  ColonyClient as ColonyClientType,
  TokenClient as TokenClientType,
} from '@colony/colony-js-client';

import BigNumber from 'bn.js';

import type { ContractTransactionType } from '~immutable';

import { getLogDate } from './blocks';

/*
 * Given a ColonyJS-parsed ColonyFundsClaimedEvent, log from which it was
 * parsed, ColonyClient and colonyENSName, return a ContractTransactionType
 * object, or null if the claim amount was zero.
 */
export const parseColonyFundsClaimedEvent = async ({
  colonyClient: {
    adapter: { provider },
  },
  colonyClient,
  colonyENSName,
  event: { payoutRemainder: amount, token },
  log: { transactionHash },
  log,
}: {
  colonyClient: ColonyClientType,
  colonyENSName: string,
  event: Object,
  log: Object,
}): Promise<?ContractTransactionType> => {
  const date = await getLogDate(colonyClient.adapter.provider, log);
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

/*
 * Given a ColonyJS-parsed ColonyFundsMovedBetweenFundingPotsEvent, log from
 * which it was parsed, ColonyClient and colonyENSName, return a
 * ContractTransactionType object.
 */
export const parseColonyFundsMovedBetweenFundingPotsEvent = async ({
  colonyClient,
  colonyENSName,
  event: { amount, fromPot, token },
  log: { transactionHash },
  log,
}: {
  colonyClient: ColonyClientType,
  colonyENSName: string,
  event: Object,
  log: Object,
}): Promise<ContractTransactionType> => {
  const date = await getLogDate(colonyClient.adapter.provider, log);

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

/*
 * Given a ColonyJS-parsed TaskPayoutClaimedEvent, log from which it was
 * parsed, and ColonyClient, return a ContractTransactionType object.
 */
export const parseTaskPayoutClaimedEvent = async ({
  event: { taskId, role, amount, token },
  log: { transactionHash: hash },
  log,
  colonyClient,
}: {
  colonyClient: ColonyClientType,
  event: Object,
  log: Object,
}): Promise<ContractTransactionType> => {
  const date = await getLogDate(colonyClient.adapter.provider, log);

  const { address: to } = await colonyClient.getTaskRole.call({ taskId, role });
  return {
    amount,
    date,
    hash,
    id: hash,
    incoming: false,
    taskId,
    to,
    token,
  };
};

/*
 * Given a ColonyJS-parsed TransferEvent, log from which it was parsed, Array
 * of Colony token claim events and associated logs from which they were
 * passed, ColonyClient, and colonyENSName, return a ContractTransactionType
 * object or null if that token has been claimed since the Transfer.
 */
export const parseUnclaimedTransferEvent = async ({
  claimEvents,
  claimLogs,
  colonyClient,
  colonyENSName,
  transferEvent: { from, tokens: amount },
  transferLog: { address: token, blockNumber, transactionHash: hash },
  transferLog,
}: {
  claimEvents: Array<Object>,
  claimLogs: Array<Object>,
  colonyClient: ColonyClientType,
  colonyENSName: string,
  transferEvent: Object,
  transferLog: Object,
}): Promise<?ContractTransactionType> => {
  const date = await getLogDate(colonyClient.adapter.provider, transferLog);

  // Only return if we haven't claimed since it happened
  return claimEvents.find(
    (claimEvent, i) =>
      claimEvent.token.toLowerCase() === token.toLowerCase() &&
      claimLogs[i].blockNumber > blockNumber,
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

/*
 * Given a ColonyJS-parsed TransferEvent for a user, the log from which it was
 * parsed, ColonyClient, and walletAddress, return a ContractTransactionType
 * object for the token transfer.
 */
export const parseUserTransferEvent = async ({
  tokenClient,
  event: { to, from, tokens: amount },
  log: { address: token, transactionHash: hash },
  log,
  walletAddress,
}: {
  tokenClient: TokenClientType,
  event: Object,
  log: Object,
  walletAddress: string,
}): Promise<ContractTransactionType> => {
  const date = await getLogDate(tokenClient.adapter.provider, log);

  return {
    amount,
    date,
    from,
    hash,
    id: hash,
    incoming: to.toLowerCase() === walletAddress.toLowerCase(),
    to,
    token,
  };
};
