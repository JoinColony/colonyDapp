/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeLatest } from 'redux-saga/effects';

import type { Action } from '~redux';

import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';
import { putError } from '~utils/saga/effects';

function* networkFetch(): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

    const { feeInverse } = yield call([
      colonyManager.networkClient.getFeeInverse,
      colonyManager.networkClient.getFeeInverse.call,
    ]);

    const { version } = yield call([
      colonyManager.networkClient.getCurrentColonyVersion,
      colonyManager.networkClient.getCurrentColonyVersion.call,
    ]);

    yield put<Action<typeof ACTIONS.NETWORK_FETCH_SUCCESS>>({
      type: ACTIONS.NETWORK_FETCH_SUCCESS,
      payload: { feeInverse: feeInverse.toString(), version },
    });
  } catch (error) {
    yield putError(ACTIONS.NETWORK_FETCH_ERROR, error);
  }
}

export default function* networkSagas(): Saga<void> {
  yield takeLatest(ACTIONS.NETWORK_FETCH, networkFetch);
}
