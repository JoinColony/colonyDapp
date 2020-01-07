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
import { Context, ContextType } from '~context/index';
import { putError } from '~utils/saga/effects';
import { log } from '~utils/debug';
import {
  refetchUserNotifications,
  SetLoggedInUserDocument,
  SetLoggedInUserMutation,
  SetLoggedInUserMutationVariables,
} from '~data/index';

import setupResolvers from '../../../context/setupResolvers';
import IPFSNode from '../../../lib/ipfs';
import { authenticate } from '../../../api';
import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import { getWallet, setupUsersSagas } from '../../users/sagas/index';
import setupTransactionsSagas from './transactions';
import setupNetworkSagas from './network';
import { getGasPrices, getColonyManager, getWalletCategory } from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';
import { setupUserBalanceListener } from './setupUserBalanceListener';

function* setupContextDependentSagas() {
  yield all([
    call(setupAdminSagas),
    call(setupDashboardSagas),
    call(setupUsersSagas),
    call(setupTransactionsSagas),
    call(setupNetworkSagas),
  ]);
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

    const apolloClient: ApolloClient<object> = yield getContext(
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
    const colonyManager = yield call(getColonyManager);
    yield setContext({
      [Context.COLONY_MANAGER]: colonyManager,
    });

    yield call(getGasPrices);

    const ens = yield getContext(Context.ENS_INSTANCE);

    /*
     * This needs to happen first because USER_CONTEXT_SETUP_SUCCESS causes a redirect
     * to dashboard, which needs context for sagas which happen on load.
     * Forking is okay because each `takeEvery` etc happens immediately anyway,
     * but we then do not wait for a return value (which will never come).
     */
    yield fork(setupContextDependentSagas);

    // Start a forked task to listen for user balance events
    yield fork(setupUserBalanceListener, walletAddress);

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

    // @TODO refactor setupUserContext for graphql
    // @BODY eventually we want to move everything to resolvers, so all of this has to happen outside of sagas. There is no need to have a separate state or anything, just set it up in an aync function (instead of WALLET_CREATE), then call this function
    const ipfsNode: IPFSNode = yield getContext(Context.IPFS_NODE);
    const userContext: ContextType = {
      apolloClient,
      colonyManager,
      ens,
      ipfsNode,
      wallet,
    };
    yield setupResolvers(apolloClient, userContext);

    yield apolloClient.mutate<
      SetLoggedInUserMutation,
      SetLoggedInUserMutationVariables
    >({
      mutation: SetLoggedInUserDocument,
      variables: {
        input: {
          balance: formatEther(balance),
          username,
          walletAddress,
        },
      },
    });

    yield refetchUserNotifications(walletAddress);

    setupOnBeforeUnload();

    yield put<AllActions>({
      type: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    });
  } catch (caughtError) {
    return yield putError(ActionTypes.WALLET_CREATE_ERROR, caughtError, meta);
  }
  return null;
}
