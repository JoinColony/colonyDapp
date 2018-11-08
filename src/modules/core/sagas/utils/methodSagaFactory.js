/* @flow */

import type { Saga } from 'redux-saga';

import { call, put } from 'redux-saga/effects';

import type {
  TransactionAction,
  Sender,
  LifecycleActionTypes,
} from '../../types';

import sendMethodTransaction from './sendMethodTransaction';

/**
 * Given a method and success/error action types, return a saga function
 * that calls the given method and `put`s the given success/error action.
 */
export default function methodSagaFactory<Params: *, EventData: *>(
  method: Sender<Params, EventData>,
  lifecycleActionTypes: LifecycleActionTypes = {},
) {
  return function* methodSaga(action: TransactionAction<Params>): Saga<void> {
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
      } = yield call(
        sendMethodTransaction,
        method,
        action,
        lifecycleActionTypes,
      );

      // Depending on the response, `put` the given success/error action.
      const { error: errorType, success: successType } = lifecycleActionTypes;
      if (error) {
        if (errorType) yield put({ type: errorType, payload: error });
      } else if (successType)
        yield put({ type: successType, payload: { receipt, eventData } });
    } catch (error) {
      // Unexpected errors `put` the given error action.
      const { error: type } = lifecycleActionTypes;
      if (type) yield put({ type, payload: error });
    }
  };
}
