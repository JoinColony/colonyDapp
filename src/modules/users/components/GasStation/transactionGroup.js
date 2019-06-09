/* @flow */

import type { TransactionType, MessageProps } from '~immutable';

export type TransactionGroup = Array<TransactionType<*, *>>;

export type TransactionGroups = Array<TransactionGroup>;

export type TransactionOrMessageGroup = Array<
  MessageProps & TransactionType<*, *>,
>;

export type TransactionOrMessageGroups = Array<TransactionOrMessageGroup>;

// get the group id (mostly used as a unique identifier for the group)
export const getGroupId = (txOrMessageGroup: TransactionOrMessageGroup) =>
  (txOrMessageGroup[0].group && txOrMessageGroup[0].group.key) ||
  txOrMessageGroup[0].id;

// Get the group key (mostly used for i18n)
export const getGroupKey = (txGroup: TransactionOrMessageGroup) =>
  txGroup[0].group
    ? `group.${txGroup[0].group.key}`
    : `${txGroup[0].context}.${txGroup[0].methodName}`;

export const findTransactionGroupByKey = (
  txGroups: TransactionOrMessageGroups,
  key: string,
) => txGroups.find(transactionGroup => getGroupKey(transactionGroup) === key);

// Since we are not currently delete old transactions we sometimes need to check
// for the newest one
export const findNewestGroup = (txGroups: TransactionOrMessageGroups) => {
  txGroups.sort((a, b) => new Date(b[0].createdAt) - new Date(a[0].createdAt));
  return txGroups[0];
};

// Get the index of the first transaction in a group that is ready to sign
export const getActiveTransactionIdx = (txGroup: TransactionOrMessageGroup) => {
  // Select the pending selection so that the user can't sign the next one
  const pendingTransactionIdx = txGroup.findIndex(
    tx => tx.status === 'pending',
  );
  if (pendingTransactionIdx > -1) return pendingTransactionIdx;
  return txGroup.findIndex(tx => tx.status === 'ready');
};

// Get transaction values to show in title or description
export const getGroupValues = (txGroup: TransactionOrMessageGroup) =>
  // For now, just returns the first transaction if we have one
  txGroup[0];

// Get the joint status of the group
export const getGroupStatus = (txGroup: TransactionOrMessageGroup) => {
  if (txGroup.some(tx => tx.status === 'failed')) return 'failed';

  /**
   * @todo Identify waiting multisig transactions (gas station tx group).
   * @body This might not be how we identify a waiting mulitsig tx
   */
  if (txGroup.some(tx => tx.status === 'multisig')) return 'multisig';
  if (txGroup.some(tx => tx.status === 'pending')) return 'pending';
  if (txGroup.every(tx => tx.status === 'succeeded')) return 'succeeded';
  return 'ready';
};

// Get count of all transactions in the redux store
export const transactionCount = (
  txOrMessageGroups: TransactionOrMessageGroups,
) => txOrMessageGroups.reduce((count, group) => count + group.length, 0);

export const isTxGroup = (txOrMessageGroup: TransactionOrMessageGroup) =>
  !!txOrMessageGroup[0].methodName;
