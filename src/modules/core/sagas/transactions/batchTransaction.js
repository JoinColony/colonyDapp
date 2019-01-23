/* @flow */

import type { Saga } from 'redux-saga';

import { put } from 'redux-saga/effects';

import type { UniqueAction } from '~types';

import type { TxActionCreator, TxActionCreatorOptions } from '../../types';

type TransactionInstruction<P> = {
  actionCreator: TxActionCreator<P>,
  // TODO: type better
  transferParams?: Function,
  transferIdentifier?: Function,
};

type BatchFactoryOptions = {
  meta: { key: string },
  // TODO: type properly!
  transactions: Array<TransactionInstruction<*>>,
};

const createBatchTxActionCreator = (txOptions: BatchFactoryOptions) =>
  // TODO: how to type variable amounts of generics?
  function* batchSaga(
    action: UniqueAction,
    // TODO: type better
    actionCreatorOptions: TxActionCreatorOptions<*>,
  ): Saga<void> {
    // TODO: check size of txOptions and actionCreatorOptions? flow?
    const { meta } = action;
    for (let i = 0; i < txOptions.transactions.length; i += 1) {
      const {
        actionCreator,
        transferParams,
        transferIdentifier,
      } = txOptions.transactions[i];
      yield put(
        actionCreator({
          meta: { ...meta, id: `${meta.id}-${i}` },
          status: transferParams || transferIdentifier ? 'created' : 'ready',
          ...actionCreatorOptions[i],
        }),
      );
    }
    // TODO: to complete actions
    // yield put(addTransactionProperties(id, { params, identifier }));
  };

export default createBatchTxActionCreator;
