/* @flow */

import type { Saga } from 'redux-saga';

import { put, select } from 'redux-saga/effects';

import type {
  TransactionParams,
  TransactionRecord,
  TransactionEventData,
} from '~immutable';

import type { CreateTransactionAction } from '../../types';

import { oneTransaction } from '../../selectors';

export default function* onTransactionCreated<
  P: TransactionParams,
  E: TransactionEventData,
>({ meta: { id } }: CreateTransactionAction<P>): Saga<void> {
  const transaction: TransactionRecord<P, E> = yield select(oneTransaction, id);
  const {
    lifecycle: { created },
  } = transaction;
  if (created) {
    yield put({
      type: created,
      meta: { id },
      payload: { transaction },
    });
  }
}
