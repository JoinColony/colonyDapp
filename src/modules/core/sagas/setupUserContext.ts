import {
  all,
  call,
  fork,
  getContext,
  put,
  setContext,
} from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import ColonyManagerType from '../../../lib/ColonyManager';
import { DDB as DDBType } from '../../../lib/database';
import { Context } from '~context/index';
import { executeCommand, executeQuery, putError } from '~utils/saga/effects';
import { log } from '~utils/debug';
import ENSCache from '~lib/ENS';
import {
  getUserBalance,
  getUsername,
  getUserProfile,
} from '../../users/data/queries';
import { createUserProfile } from '../../users/data/commands';
import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import {
  getWallet,
  setupUsersSagas,
  setupInboxSagas,
} from '../../users/sagas/index';
import setupTransactionsSagas from './transactions';
import setupConnectionSagas from './connection';
import setupNetworkSagas from './network';
import {
  getDDB,
  getGasPrices,
  getColonyManager,
  getWalletCategory,
} from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';
import { createAddress, Address } from '~types/index';

function* setupContextDependentSagas() {
  yield all([
    call(setupAdminSagas),
    call(setupConnectionSagas),
    call(setupDashboardSagas),
    call(setupUsersSagas),
    call(setupInboxSagas),
    call(setupTransactionsSagas),
    call(setupNetworkSagas),
  ]);
}

function* setupDDBResolver(
  colonyManager: ColonyManagerType,
  ddb: DDBType,
  ens: ENSCache,
) {
  const { networkClient } = colonyManager;

  yield call([ddb, ddb.registerResolver], (identifier: string) =>
    ens.getOrbitDBAddress(identifier, networkClient),
  );
}

function* recoverUserProfile(walletAddress: Address) {
  const username = yield executeQuery(getUsername, {
    args: { walletAddress },
  });
  if (!username) return {};
  const { metadataStore, inboxStore } = yield executeCommand(
    createUserProfile,
    {
      args: { username, walletAddress },
      metadata: { walletAddress },
    },
  );
  return {
    username,
    metadataStoreAddress: metadataStore.address.toString(),
    inboxStoreAddress: inboxStore.address.toString(),
  };
}

/*
 * Given an action to get the user’s wallet, use this wallet to initialise the initial
 * context that depends on it (the wallet itself, the DDB, the ColonyManager),
 * and then any other context that depends on that.
 */
export default function* setupUserContext(
  action: Action<ActionTypes.WALLET_CREATE>,
) {
  const {
    meta,
    payload: { method },
  } = action;
  try {
    /*
     * Get the wallet and set it in context.
     */
    const wallet = yield call(getWallet, action);
    const walletAddress = createAddress(wallet.address);
    yield setContext({ [Context.WALLET]: wallet });

    yield put<AllActions>({
      type: ActionTypes.WALLET_CREATE_SUCCESS,
      payload: {
        walletType: getWalletCategory(method),
      },
    });

    /*
     * Set up the DDB instance and colony manager context.
     */
    const [ddb, colonyManager] = yield all([
      call(getDDB),
      call(getColonyManager),
    ]);
    yield setContext({
      [Context.COLONY_MANAGER]: colonyManager,
      [Context.DDB_INSTANCE]: ddb,
    });

    yield call(getGasPrices);

    const ens = yield getContext(Context.ENS_INSTANCE);
    yield call(setupDDBResolver, colonyManager, ddb, ens);

    let profileData = {};
    try {
      profileData = yield executeQuery(getUserProfile, {
        metadata: { walletAddress },
      });
    } catch (e) {
      log.verbose(`Could not find user profile for ${walletAddress}`);
    }

    if (!(profileData as any).username) {
      // Try to recover a user profile as it might already have been registered on ENS
      profileData = yield call(recoverUserProfile, walletAddress);
    }

    const balance = yield executeQuery(getUserBalance, {
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

    yield put<AllActions>({
      type: ActionTypes.CURRENT_USER_CREATE,
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
      yield put<AllActions>({
        type: ActionTypes.INBOX_ITEMS_FETCH,
        payload: undefined,
        meta,
      });
    } catch (caughtError) {
      // It's ok if the user store doesn't exist (yet)
      log.warn(caughtError);
    }

    yield call(setupOnBeforeUnload);
  } catch (caughtError) {
    return yield putError(ActionTypes.WALLET_CREATE_ERROR, caughtError, meta);
  }
  return null;
}
