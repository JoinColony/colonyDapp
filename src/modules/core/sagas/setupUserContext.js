/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  fork,
  getContext,
  put,
  setContext,
} from 'redux-saga/effects';

import type { Action } from '~redux';

import type ColonyManagerType from '../../../lib/ColonyManager';
import type { DDB as DDBType } from '../../../lib/database';

import { CONTEXT } from '~context';
import { ACTIONS } from '~redux';
import { executeQuery, putError } from '~utils/saga/effects';
import { log } from '~utils/debug';

import ENS from '../../../lib/ENS';
import { getUserBalance, getUserProfile } from '../../../data/service/queries';
import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import { getWallet, setupUsersSagas } from '../../users/sagas';
import setupTransactionsSagas from './transactions';
import { getDDB, getGasPrices, getColonyManager } from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';

function* setupContextDependentSagas(): Saga<void> {
  yield all([
    call(setupAdminSagas),
    call(setupDashboardSagas),
    call(setupUsersSagas),
    call(setupTransactionsSagas),
  ]);
}

function* setupDDBResolver(
  colonyManager: ColonyManagerType,
  ddb: DDBType,
  ens: ENS,
) {
  const { networkClient } = colonyManager;

  yield call([ddb, ddb.registerResolver], (identifier: string) =>
    ens.getOrbitDBAddress(identifier, networkClient),
  );
}

/*
 * Given an action to get the user’s wallet, use this wallet to initialise the initial
 * context that depends on it (the wallet itself, the DDB, the ColonyManager),
 * and then any other context that depends on that.
 */
export default function* setupUserContext(
  action: Action<typeof ACTIONS.WALLET_CREATE>,
): Saga<void> {
  const { meta } = action;
  try {
    /*
     * Get the wallet and set it in context.
     */
    const wallet = yield call(getWallet, action);
    const { address: walletAddress } = wallet;
    yield setContext({ [CONTEXT.WALLET]: wallet });

    /*
     * Set up the DDB instance and colony manager context.
     */
    const [ddb, colonyManager] = yield all([
      call(getDDB),
      call(getColonyManager),
    ]);
    yield setContext({
      [CONTEXT.COLONY_MANAGER]: colonyManager,
      [CONTEXT.DDB_INSTANCE]: ddb,
    });

    yield call(getGasPrices);

    const ens = yield getContext('ens');

    yield call(setupDDBResolver, colonyManager, ddb, ens);

    /*
     * Attempt to get the user profile data.
     */
    let profileData = {};
    try {
      profileData = yield* executeQuery(
        { ddb, metadata: { walletAddress } },
        getUserProfile,
      );
    } catch (error) {
      // It's on here if the user store doesn't exist (yet)
      log.warn(error);
    }

    /*
     * Get the user's wallet balance
     */
    const { networkClient } = colonyManager;
    const balance = yield* executeQuery(
      { networkClient },
      getUserBalance,
      walletAddress,
    );

    /*
     * This needs to happen first because CURRENT_USER_CREATE causes a redirect
     * to dashboard, which needs context for sagas which happen on load.
     * Forking is okay because each `takeEvery` etc happens immediately anyway,
     * but we then do not wait for a return value (which will never come).
     */
    yield fork(setupContextDependentSagas);

    yield put<Action<typeof ACTIONS.CURRENT_USER_CREATE>>({
      type: ACTIONS.CURRENT_USER_CREATE,
      payload: {
        balance,
        profileData,
        walletAddress,
      },
      meta: {
        ...meta,
        keyPath: [walletAddress],
      },
    });

    yield call(setupOnBeforeUnload);
  } catch (error) {
    yield putError(ACTIONS.WALLET_CREATE_ERROR, error, meta);
  }
}
