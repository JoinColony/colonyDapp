import {
  TransactionType,
  MessageType,
  TRANSACTION_STATUSES,
} from '~immutable/index';

export type TransactionOrMessageGroup = (TransactionType | MessageType)[];

export type TransactionOrMessageGroups = TransactionOrMessageGroup[];

// get the group id (mostly used as a unique identifier for the group)
export const getGroupId = (txOrMessageGroup: TransactionOrMessageGroup) => {
  // Typescripts flow inference totall seems to fall apart here
  if (!txOrMessageGroup[0]) return undefined;
  if ((txOrMessageGroup[0] as TransactionType).group) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Array.isArray((txOrMessageGroup[0] as TransactionType).group!.id)
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ((txOrMessageGroup[0] as TransactionType).group!.id as string[]).join(
          '.',
        )
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ((txOrMessageGroup[0] as TransactionType).group!.id as string);
  }
  return txOrMessageGroup[0].id;
};

// Get the group key (mostly used for i18n)
export const getGroupKey = (txGroup: TransactionOrMessageGroup) => {
  if ((txGroup[0] as TransactionType).group) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return `group.${(txGroup[0] as TransactionType).group!.key}`;
  }
  if (
    (txGroup[0] as TransactionType).context &&
    (txGroup[0] as TransactionType).methodName
  ) {
    return `${(txGroup[0] as TransactionType).context}.${
      (txGroup[0] as TransactionType).methodName
    }`;
  }
  return txGroup[0].id;
};

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
export const getGroupValues = <T>(
  txGroup: T[], // For now, just returns the first transaction if we have one
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
   * the `context` prop will be set to `undefined`. Typescript will be happy this way
   */
  Object.prototype.hasOwnProperty.call(txOrMessageGroup[0], 'context');
