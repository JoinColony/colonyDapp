/* @flow */

import type { Saga } from 'redux-saga';

import { setContext, call, all, put, fork } from 'redux-saga/effects';

import { create, executeQuery, putError } from '~utils/saga/effects';
import { CONTEXT } from '~context';
import { ACTIONS } from '~redux';

import type { Action } from '~redux';

import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import setupTransactionsSagas from './transactions';
import { getWallet, setupUsersSagas } from '../../users/sagas';
import { getUserBalance, getUserProfile } from '../../../data/service/queries';

import { getDDB, getColonyManager } from './utils';

import * as resolvers from '../../../lib/database/resolvers';
import type ColonyManagerType from '../../../lib/ColonyManager';
import type { DDB as DDBType } from '../../../lib/database';

function* setupContextDependentSagas(): Saga<void> {
  yield all([
    call(setupAdminSagas),
    call(setupDashboardSagas),
    call(setupUsersSagas),
    call(setupTransactionsSagas),
  ]);
}

function* setupDDBResolvers(colonyManager: ColonyManagerType, ddb: DDBType) {
  const { networkClient } = colonyManager;

  // Add username ENS resolver
  const userResolver = yield create(resolvers.UserResolver, networkClient);
  yield call([ddb, ddb.addResolver], 'user', userResolver);

  // Add colony ENS resolver
  const colonyResolver = yield create(resolvers.ColonyResolver, networkClient);
  yield call([ddb, ddb.addResolver], 'colony', colonyResolver);
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

    yield call(setupDDBResolvers, colonyManager, ddb);

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
      // Ignore; it's ok if the user profile store doesn't exist yet.
    }

    /*
     * Get the user's wallet balance
     */
    const { networkClient } = colonyManager;
    const balance = yield* executeQuery(
      { networkClient, metadata: { walletAddress } },
      getUserBalance,
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
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.WALLET_CREATE_ERROR, error, meta);
  }
}
