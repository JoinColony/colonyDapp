/* @flow */

import type { Saga } from 'redux-saga';

import { setContext, call, all, put, fork } from 'redux-saga/effects';
import { formatEther } from 'ethers/utils';

import { create, putError } from '~utils/saga/effects';
import { CONTEXT } from '~context';
import { ACTIONS } from '~redux';

import type { UserProfileType } from '~immutable';
import type { ActionsType } from '~redux';

import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import setupTransactionsSagas from './transactions';
import {
  getOrCreateUserStore,
  getUserProfileData,
  getWallet,
  setupUserSagas,
} from '../../users/sagas';

import { getDDB, getColonyManager, defaultNetwork, getProvider } from './utils';

import * as resolvers from '../../../lib/database/resolvers';

function* setupContextSagas(): any {
  yield all([
    setupAdminSagas(),
    setupDashboardSagas(),
    setupUserSagas(),
    setupTransactionsSagas(),
  ]);
}

/**
 * Given an action to get the user’s wallet, use this wallet to initialise the initial
 * context that depends on it (the wallet itself, the DDB, the ColonyManager),
 * and then any other context that depends on that.
 */
export default function* setupUserContext(
  action: $PropertyType<ActionsType, 'WALLET_CREATE'>,
): Saga<void> {
  const { meta } = action;
  try {
    const wallet = yield call(getWallet, action);
    const provider = yield call(getProvider, defaultNetwork);
    yield setContext({ [CONTEXT.WALLET]: wallet });
    const [ddb, colonyManager] = yield all([
      call(getDDB),
      call(getColonyManager),
    ]);

    // Add username ENS resolver
    const userResolver = yield create(
      resolvers.UserResolver,
      colonyManager.networkClient,
    );
    yield call([ddb, ddb.addResolver], 'user', userResolver);

    // Add colony ENS resolver
    const colonyResolver = yield create(
      resolvers.ColonyResolver,
      colonyManager.networkClient,
    );
    yield call([ddb, ddb.addResolver], 'colony', colonyResolver);

    yield setContext({
      [CONTEXT.COLONY_MANAGER]: colonyManager,
      [CONTEXT.DDB_INSTANCE]: ddb,
    });

    const userStore = yield call(getOrCreateUserStore, wallet.address);

    const profileData: UserProfileType = yield call(
      getUserProfileData,
      userStore,
    );

    /*
     * @NOTE Wallet balance is returned as a BigNumber instance, in WEI
     */
    const walletBalance = yield call(
      [provider, provider.getBalance],
      wallet.address,
    );

    // TODO: the user could potentially alter their username on the DDB w/o changing it on the DDB

    // This needs to happen first because CURRENT_USER_CREATE causes a redirect
    // to dashboard, which needs context for sagas which happen on load.
    // Forking is okay because each `takeEvery` etc happens immediately anyway,
    // but we then do not wait for a return value (which will never come).
    yield fork(setupContextSagas);

    yield put({
      type: ACTIONS.CURRENT_USER_CREATE,
      payload: {
        profileData,
        walletAddress: wallet.address,
        balance: formatEther(walletBalance),
      },
      meta,
    });
  } catch (err) {
    yield putError(ACTIONS.WALLET_CREATE_ERROR, err, meta);
  }
}
