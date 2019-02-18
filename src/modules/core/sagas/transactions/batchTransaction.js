/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, select, take } from 'redux-saga/effects';

import type { TransactionRecordType } from '~immutable';
import type { Action, ActionTypeWithMeta, UniqueActionType } from '~redux';

import type { TxActionCreator } from '../../types';

import { ACTIONS } from '~redux';

import { transactionAddProperties } from '../../actionCreators';
import { oneTransaction } from '../../selectors';

type ArrayOfTransactions = TransactionRecordType<*, *>[];

type TransactionInstruction<P> = {
  actionCreator: TxActionCreator<P>,
  before?: ArrayOfTransactions => any,
  transferParams?: (ArrayOfTransactions, beforeResult?: any) => Object | void,
  transferIdentifier?: (
    ArrayOfTransactions,
    beforeResult?: any,
  ) => string | void,
};

type BatchFactoryOptions = {
  meta: { key: string },
  transactions: Array<TransactionInstruction<*>>,
};

const createBatchTxRunner = (txOptions: BatchFactoryOptions) => {
  function* waitForNext(
    txId: string,
    idx: number = 0,
    transactions: ArrayOfTransactions = [],
  ): Saga<ArrayOfTransactions> {
    const batchedTxId = `${txId}-${idx}`;
    const {
      before,
      transferParams,
      transferIdentifier,
    } = txOptions.transactions[idx];

    if (transactions.length && (transferParams || transferIdentifier)) {
      const payload = {};
      let result;
      if (typeof before === 'function') {
        result = yield call(before, transactions);
      }
      if (transferParams) {
        payload.params = transferParams(transactions, result);
      }
      if (transferIdentifier) {
        payload.identifier = transferIdentifier(transactions, result);
      }
      // This will make the transaction `ready`, so that the user can sign it
      yield put<Action<typeof ACTIONS.TRANSACTION_ADD_PROPERTIES>>(
        transactionAddProperties(batchedTxId, payload),
      );
    }

    // Wait until success for this transaction is reported
    yield take(
      (txAction: ActionTypeWithMeta<*, { id: string }>) =>
        txAction.meta &&
        txAction.meta.id === batchedTxId &&
        txAction.type === ACTIONS.TRANSACTION_SUCCEEDED,
    );

    // TODO: Error handling, retry, timeout?
    // We don't have any means to retry transactions, yet, so error handling has to come later

    // If there are more transactions, continue
    if (idx < txOptions.transactions.length - 1) {
      const transaction = yield select(oneTransaction, batchedTxId);
      transactions.push(transaction);
      yield call(waitForNext, txId, idx + 1, transactions);
    }
    return transactions;
  }

  function* batchSaga(
    { meta }: UniqueActionType<*, *, Object>,
    // chris: There might be a way to type this better but for me it seems close to impossible
    actionCreatorOptions: $ReadOnlyArray<?{
      options?: Object,
      params: Object,
    }>,
  ): Saga<ArrayOfTransactions> {
    for (let i = 0; i < txOptions.transactions.length; i += 1) {
      const {
        actionCreator,
        transferParams,
        transferIdentifier,
      } = txOptions.transactions[i];
      const actionCreatorOpts = {
        meta: { ...meta, id: `${meta.id}-${i}` },
        status: transferParams || transferIdentifier ? 'created' : 'ready',
        groupId: meta.id,
        ...actionCreatorOptions[i],
      };
      yield put(actionCreator(actionCreatorOpts));
    }
    return yield call(waitForNext, meta.id);
  }

  return batchSaga;
};

export default createBatchTxRunner;
