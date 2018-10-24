/* @flow */

import type { Saga } from 'redux-saga';

import { call, put } from 'redux-saga/effects';

import type { TransactionAction, Sender } from '../../types';

import { sendTransaction } from './sendTransaction';

/**
 * Given a method and success/error action types, return a saga function
 * that calls the given method and `put`s the given success/error action.
 */
export default function methodSagaFactory<Params: Object, EventData: Object>(
  method: Sender<Params, EventData>,
  successType,
  errorType,
) {
  return function* methodSaga(
    action: TransactionAction<Params>,
  ): Saga<typeof undefined> {
    try {
      // Execute the send transaction task and get the error/success response.
      const {
        error,
        receipt,
        eventData,
      }: {
        error?: Error,
        receipt?: Object,
        eventData?: EventData,
      } = yield call(sendTransaction, method, action);

      // Depending on the response, `put` the given success/error action.
      yield put(
        error
          ? { type: errorType, payload: error }
          : { type: successType, payload: { receipt, eventData } },
      );
    } catch (error) {
      // Unexpected errors `put` the given error action.
      yield put({ type: errorType, payload: error });
    }
  };
}
