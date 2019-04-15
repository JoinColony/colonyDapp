/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeLatest } from 'redux-saga/effects';

import type { Action } from '~redux';

import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';
import { putError } from '~utils/saga/effects';

function* networkFeeFetch(): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

    const { feeInverse } = yield call([
      colonyManager.networkClient.getFeeInverse,
      colonyManager.networkClient.getFeeInverse.call,
    ]);

    yield put<Action<typeof ACTIONS.NETWORK_FETCH_FEE_SUCCESS>>({
      type: ACTIONS.NETWORK_FETCH_FEE_SUCCESS,
      payload: { feeInverse },
    });
  } catch (error) {
    yield putError(ACTIONS.NETWORK_FETCH_FEE_ERROR, error);
  }
}

function* networkVersionFetch(): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

    const { version } = yield call([
      colonyManager.networkClient.getCurrentColonyVersion,
      colonyManager.networkClient.getCurrentColonyVersion.call,
    ]);

    yield put<Action<typeof ACTIONS.NETWORK_FETCH_VERSION_SUCCESS>>({
      type: ACTIONS.NETWORK_FETCH_VERSION_SUCCESS,
      payload: { version },
    });
  } catch (error) {
    yield putError(ACTIONS.NETWORK_FETCH_VERSION_ERROR, error);
  }
}

export default function* networkSagas(): Saga<void> {
  yield takeLatest(ACTIONS.NETWORK_FETCH_FEE, networkFeeFetch);
  yield takeLatest(ACTIONS.NETWORK_FETCH_VERSION, networkVersionFetch);
}
