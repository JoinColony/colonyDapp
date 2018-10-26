/* @flow */

import { all, call, put, takeLatest, setContext } from 'redux-saga/effects';

import {
  CHANGE_WALLET,
  CHANGE_WALLET_ERROR,
  SET_CURRENT_USER,
} from '../../users/actionTypes';

import setupUsersSagas, { getWallet, getUser } from '../../users/sagas';
import { getNetworkClient } from './networkClient';
import { getDDB } from './ddb';

function* setupUserContext(action: Object): any {
  try {
    const wallet = yield call(getWallet, action);
    yield setContext({ wallet });
    const [ddb, networkClient] = yield all([
      call(getDDB),
      call(getNetworkClient),
    ]);
    yield setContext({ ddb, networkClient });
    const user = yield call(getUser);
    yield put({
      type: SET_CURRENT_USER,
      payload: {
        walletAddress: wallet.address,
        set: user,
      },
    });
  } catch (err) {
    // TOOD: I think we want a putError effect maybe?
    // Base i18n on type
    yield put({
      type: CHANGE_WALLET_ERROR,
      payload: {
        error: {
          message: err.message,
          stack: err.stack,
        },
      },
    });
  }
}

function* rootSaga(): any {
  /*
   * CHANGE_WALLET
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(CHANGE_WALLET, setupUserContext);
  // Everything else that does not require a wallet
  yield all([setupUsersSagas()]);
}

export default rootSaga;
