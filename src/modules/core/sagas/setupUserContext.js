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
import {
  getUserBalance,
  getUserProfile,
  getUserColonies,
} from '../../users/data/queries';
import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import { getWallet, setupUsersSagas } from '../../users/sagas';
import setupTransactionsSagas from './transactions';
import setupNetworkSagas from './network';
import { getDDB, getGasPrices, getColonyManager } from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';

function* setupContextDependentSagas(): Saga<void> {
  yield all([
    call(setupAdminSagas),
    call(setupDashboardSagas),
    call(setupUsersSagas),
    call(setupTransactionsSagas),
    call(setupNetworkSagas),
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

    const ens = yield getContext(CONTEXT.ENS_INSTANCE);
    yield call(setupDDBResolver, colonyManager, ddb, ens);

    let profileData = {};
    try {
      profileData = yield* executeQuery(getUserProfile, {
        metadata: { walletAddress },
      });
    } catch (caughtError) {
      // It's ok if the user store doesn't exist (yet)
      log.warn(caughtError);
    }

    /*
     * Get the user's wallet balance
     */
    const balance = yield* executeQuery(getUserBalance, {
      args: {
        walletAddress,
      },
    });

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
        key: walletAddress,
      },
    });

    try {
      const userColonies = yield* executeQuery(getUserColonies, {
        metadata: {
          walletAddress,
          /*
           * @note there's some Flow shennanings going on with how this
           * type is declared in the `getUserProfile` query
           */
          /* $FlowFixMe */
          metadataStoreAddress: profileData.metadataStoreAddress,
        },
      });

      for (let index = 0; index < userColonies.length; index += 1) {
        const colonyClient = yield call(
          [colonyManager, colonyManager.getColonyClient],
          userColonies[index],
        );

        /*
         * Load the user activities from the store
         */
        yield put<Action<typeof ACTIONS.USER_ACTIVITIES_FETCH>>({
          type: ACTIONS.USER_ACTIVITIES_FETCH,
          payload: {
            colonyClient,
          },
          meta: {
            ...meta,
            key: walletAddress,
            colonyAddress: userColonies[index],
          },
        });
      }
    } catch (caughtError) {
      // It's ok if the user store doesn't exist (yet)
      log.warn(caughtError);
    }

    yield call(setupOnBeforeUnload);
  } catch (caughtError) {
    yield putError(ACTIONS.WALLET_CREATE_ERROR, caughtError, meta);
  }
}
