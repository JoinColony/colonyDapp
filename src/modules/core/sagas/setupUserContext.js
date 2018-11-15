/* @flow */

import type { Saga } from 'redux-saga';

import { setContext, call, all, put, fork } from 'redux-saga/effects';

import { create, putError } from '~utils/saga/effects';

import type { Action } from '~types/index';

import setupDashboardSagas from '../../dashboard/sagas';
import setupTransactionsSagas from './transactions';
import {
  getUser,
  getUserStore,
  getWallet,
  setupUserSagas,
} from '../../users/sagas';
import {
  CURRENT_USER_CREATE,
  WALLET_CREATE_ERROR,
} from '../../users/actionTypes';

import { getDDB, getNetworkClient } from './utils';

import * as resolvers from '../../../lib/database/resolvers';

function* setupContextSagas(): any {
  yield all([
    setupDashboardSagas(),
    setupUserSagas(),
    setupTransactionsSagas(),
  ]);
}

/**
 * Given an action to get the user’s wallet, use this wallet to initialise the initial
 * context that depends on it (the wallet itself, the DDB, the network client),
 * and then any other context that depends on that.
 */
export default function* setupUserContext(action: Action): Saga<void> {
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

    // TODO: the user could potentially alter their username on the DDB w/o changing it on the DDB

    // This needs to happen first because CURRENT_USER_CREATE causes a redirect
    // to dashboard, which needs context for sagas which happen on load.
    // TODO: what are the implications of forking here?
    yield fork(setupContextSagas);

    yield put({
      type: CURRENT_USER_CREATE,
      payload: {
        user,
        walletAddress: wallet.address,
        // Address is an orbit address object
        orbitStore: userStore.address.toString(),
      },
    });
  } catch (err) {
    yield putError(WALLET_CREATE_ERROR, err);
  }
}
