import ApolloClient from 'apollo-client';
import {
  all,
  call,
  fork,
  getContext,
  put,
  setContext,
} from 'redux-saga/effects';
import { formatEther } from 'ethers/utils';

import { createAddress } from '~types/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { Context } from '~context/index';
import { putError } from '~utils/saga/effects';
import { log } from '~utils/debug';
import ENSCache from '~lib/ENS';
import { SetLoggedInUserDocument } from '~data/index';

import ColonyManagerType from '../../../lib/ColonyManager';
import { DDB as DDBType } from '../../../lib/database';
import { authenticate } from '../../../api';
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
import { setupUserBalanceListener } from './setupUserBalanceListener';

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

    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield authenticate(wallet);

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

    let username;

    try {
      const domain = yield ens.getDomain(
        walletAddress,
        colonyManager.networkClient,
      );
      username = ens.constructor.stripDomainParts('user', domain);
    } catch (caughtError) {
      log.verbose(`Could not find username for ${walletAddress}`);
    }

    const {
      adapter: { provider },
    } = colonyManager.networkClient;
    const balance = yield provider.getBalance(walletAddress);

    yield apolloClient.mutate({
      mutation: SetLoggedInUserDocument,
      variables: {
        input: {
          balance: formatEther(balance),
          username,
          walletAddress,
        },
      },
    });

    /*
     * This needs to happen first because USER_CONTEXT_SETUP_SUCCESS causes a redirect
     * to dashboard, which needs context for sagas which happen on load.
     * Forking is okay because each `takeEvery` etc happens immediately anyway,
     * but we then do not wait for a return value (which will never come).
     */
    yield fork(setupContextDependentSagas);

    // Start a forked task to listen for user balance events
    yield fork(setupUserBalanceListener, walletAddress);

    yield put<AllActions>({
      type: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    });

    // try {
    //   yield put<AllActions>({
    //     type: ActionTypes.INBOX_ITEMS_FETCH,
    //   });
    // } catch (caughtError) {
    //   // It's ok if the user store doesn't exist (yet)
    //   log.warn(caughtError);
    // }

    yield call(setupOnBeforeUnload);
  } catch (caughtError) {
    return yield putError(ActionTypes.WALLET_CREATE_ERROR, caughtError, meta);
  }
  return null;
}
