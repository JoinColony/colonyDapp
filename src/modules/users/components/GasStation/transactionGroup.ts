import {
  TransactionType,
  MessageProps,
  TRANSACTION_STATUSES,
} from '~immutable/index';

export type TransactionOrMessageGroup = (TransactionType & MessageProps)[];

export type TransactionOrMessageGroups = TransactionOrMessageGroup[];

// get the group id (mostly used as a unique identifier for the group)
export const getGroupId = (txOrMessageGroup: TransactionOrMessageGroup) =>
  txOrMessageGroup[0].id ||
  (txOrMessageGroup[0].group && txOrMessageGroup[0].group.key);

// Get the group key (mostly used for i18n)
export const getGroupKey = (txGroup: TransactionOrMessageGroup) =>
  txGroup[0].group
    ? `group.${txGroup[0].group.key}`
    : `${txGroup[0].context}.${txGroup[0].methodName}`;

export const findTransactionGroupByKey = (
  txGroups: TransactionOrMessageGroups,
  key: string,
) => txGroups.find(txGroup => getGroupKey(txGroup) === key);

// Since we are not currently delete old transactions we sometimes need to check
// for the newest one
export const findNewestGroup = (txGroups: TransactionOrMessageGroups) => {
  // @ts-ignore
  txGroups.sort((a, b) => new Date(b[0].createdAt) - new Date(a[0].createdAt));
  return txGroups[0];
};

// Get the index of the first transaction in a group that is ready to sign
export const getActiveTransactionIdx = (txGroup: TransactionOrMessageGroup) => {
  // Select the pending selection so that the user can't sign the next one
  const pendingTransactionIdx = txGroup.findIndex(
    tx => tx.status === TRANSACTION_STATUSES.PENDING,
  );
  if (pendingTransactionIdx > -1) return pendingTransactionIdx;
  return txGroup.findIndex(
    tx =>
      tx.status === TRANSACTION_STATUSES.READY ||
      tx.status === TRANSACTION_STATUSES.FAILED,
  );
};

// Get transaction values to show in title or description
export const getGroupValues = (
  txGroup: TransactionOrMessageGroup, // For now, just returns the first transaction if we have one
) => txGroup[0];

// Get the joint status of the group
export const getGroupStatus = (txGroup: TransactionOrMessageGroup) => {
  if (txGroup.some(tx => tx.status === TRANSACTION_STATUSES.FAILED))
    return TRANSACTION_STATUSES.FAILED;

  /**
   * @todo Identify waiting multisig transactions (gas station tx group).
   * @body This might not be how we identify a waiting mulitsig tx
   */
  if (txGroup.some(tx => tx.status === TRANSACTION_STATUSES.MULTISIG))
    return TRANSACTION_STATUSES.MULTISIG;
  if (txGroup.some(tx => tx.status === TRANSACTION_STATUSES.PENDING))
    return TRANSACTION_STATUSES.PENDING;
  if (txGroup.every(tx => tx.status === TRANSACTION_STATUSES.SUCCEEDED))
    return TRANSACTION_STATUSES.SUCCEEDED;
  return TRANSACTION_STATUSES.READY;
};

// Get count of all transactions in the redux store
export const transactionCount = (
  txOrMessageGroups: TransactionOrMessageGroups,
) => txOrMessageGroups.reduce((count, group) => count + group.length, 0);

/**
 * @NOTE Determine if we're dealing with a group of Transactions or a group of Messages to be signed.
 * @BODY Based on this we either show a `<TransactionCard />` or a `<MessageCard />`
 */
export const isTxGroup = (txOrMessageGroup: TransactionOrMessageGroup) =>
  /**
   * @NOTE Uses `hasOwnProperty` because if the transaction group contains only one transaction
   * the `group` prop will be set to `undefined`
   */
  Object.prototype.hasOwnProperty.call(txOrMessageGroup[0], 'group');
