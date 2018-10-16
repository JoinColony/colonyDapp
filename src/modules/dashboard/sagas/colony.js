/* @flow */

import type { Saga } from 'redux-saga';

import { call, takeEvery, getContext, put } from 'redux-saga/effects';

import type { TransactionAction } from '../../core/types';

import { methodSagaFactory } from '../../core/utils/transactions';

import {
  CREATE_COLONY,
  CREATE_COLONY_SUCCESS,
  CREATE_COLONY_ERROR,
  CREATE_TOKEN,
} from '../actionTypes';
import { createTokenError, createTokenSuccess } from '../actionCreators';

const NETWORK_METHODS = {
  [CREATE_COLONY]: ['createColony', CREATE_COLONY_SUCCESS, CREATE_COLONY_ERROR],
  // Add methods as needed.
};

const NETWORK_METHOD_TYPES = Object.keys(NETWORK_METHODS);

function* networkMethodSaga(action: TransactionAction<*, *>) {
  const [methodName, successType, errorType] = NETWORK_METHODS[action.type];
  try {
    const {
      instance: { [methodName]: method },
    } = yield getContext('networkClient');
    const saga = methodSagaFactory(method, action, successType, errorType);
    yield call(saga);
  } catch (error) {
    yield put({ type: errorType, payload: { error } });
  }
}

// `createToken` is not a regular sender and thus needs some special treatment.
function* createTokenSaga({ payload: { name, symbol } }: Object): Saga<*> {
  try {
    const { instance: networkClient } = yield getContext('networkClient');

    const address = yield call([networkClient, networkClient.createToken], {
      name,
      symbol,
    });
    yield put(createTokenSuccess(name, symbol, address));
  } catch (error) {
    yield put(createTokenError(error));
  }
}

export default function* colonySagas() {
  yield takeEvery(CREATE_TOKEN, createTokenSaga);
  yield takeEvery(NETWORK_METHOD_TYPES, networkMethodSaga);
}
