/* @flow */

import { all, call, put, takeLatest, setContext } from 'redux-saga/effects';

import { create, putError } from '~utils/saga/effects';

import {
  WALLET_CREATE,
  WALLET_CREATE_ERROR,
  CURRENT_USER_CREATE,
} from '../../users/actionTypes';

import { resolvers } from '../../../lib/database';
import setupDashboardSagas from '../../dashboard/sagas';
import {
  getWallet,
  getUserStore,
  getUser,
  setupUserSagas,
  setupWalletSagas,
} from '../../users/sagas';

import { getNetworkClient } from './networkClient';
import { getDDB } from './ddb';

/**
 * Given an action to get the user’s wallet, use this wallet to initialise the initial
 * context that depends on it (the wallet itself, the DDB, the network client),
 * and then any other context that depends on that.
 */
function* setupUserContext(action: Object): any {
  try {
    const wallet = yield call(getWallet, action);
    yield setContext({ wallet });
    const [ddb, networkClient] = yield all([
      call(getDDB),
      call(getNetworkClient),
    ]);

    // Add username ENS resolver
    const userResolver = yield create(resolvers.UserResolver, networkClient);
    yield call([ddb, ddb.addResolver], 'user', userResolver);

    yield setContext({ ddb, networkClient });

    const userStore = yield call(getUserStore, wallet.address);
    const user = yield call(getUser, userStore);

    yield put({
      type: CURRENT_USER_CREATE,
      payload: {
        user,
        walletAddress: wallet.address,
        // Address is an orbit address object
        orbitStore: userStore.address.toString(),
      },
    });
    yield call(setupContextSagas);
  } catch (err) {
    yield putError(WALLET_CREATE_ERROR, err);
  }
}

function* setupContextSagas(): any {
  yield all([setupDashboardSagas(), setupUserSagas()]);
}

function* rootSaga(): any {
  /*
   * WALLET_CREATE
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(WALLET_CREATE, setupUserContext);
  // Everything else that does not require a wallet
  yield all([setupWalletSagas()]);
}

export default rootSaga;
