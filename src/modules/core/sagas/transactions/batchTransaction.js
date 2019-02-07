/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, select, take } from 'redux-saga/effects';

import type { TransactionRecord } from '~immutable';
import type { UniqueAction } from '~types';

import type { TxActionCreator } from '../../types';

import { transactionAddProperties } from '../../actionCreators';
import { TRANSACTION_EVENT_DATA_RECEIVED } from '../../actionTypes';
import { oneTransaction } from '../../selectors';

type ArrayOfTransactions = TransactionRecord<*, *>[];

type TransactionInstruction<P> = {
  actionCreator: TxActionCreator<P>,
  transferParams?: ArrayOfTransactions => Object | void,
  transferIdentifier?: ArrayOfTransactions => string | void,
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
    const { transferParams, transferIdentifier } = txOptions.transactions[idx];

    if (transactions.length && (transferParams || transferIdentifier)) {
      const payload = {};
      if (transferParams) {
        payload.params = transferParams(transactions);
      }
      if (transferIdentifier) {
        payload.identifier = transferIdentifier(transactions);
      }
      // This will make the transaction `ready`, so that the user can sign it
      yield put(transactionAddProperties(batchedTxId, payload));
    }

    // Wait until success for this transaction is reported
    yield take(
      (txAction: UniqueAction) =>
        txAction.meta &&
        txAction.meta.id === batchedTxId &&
        txAction.type === TRANSACTION_EVENT_DATA_RECEIVED,
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
    action: UniqueAction,
    // chris: There might be a way to type this better but for me it seems close to impossible
    actionCreatorOptions: $ReadOnlyArray<?{
      options?: Object,
      params: Object,
    }>,
  ): Saga<ArrayOfTransactions> {
    const { meta } = action;
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
