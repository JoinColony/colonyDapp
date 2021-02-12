import { all, call, fork, put } from 'redux-saga/effects';
import { formatEther } from 'ethers/utils';

import { WalletMethod } from '~immutable/index';
import { createAddress } from '~utils/web3';
import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  TEMP_getContext,
  TEMP_setContext,
  ContextModule,
} from '~context/index';
import { putError } from '~utils/saga/effects';
import { log } from '~utils/debug';
import { setLastWallet } from '~utils/autoLogin';
import {
  refetchUserNotifications,
  SetLoggedInUserDocument,
  SetLoggedInUserMutation,
  SetLoggedInUserMutationVariables,
  LoggedInUserQuery,
  LoggedInUserQueryVariables,
  LoggedInUserDocument,
  updateNetworkContracts,
  cacheUpdates,
} from '~data/index';

import setupResolvers from '~context/setupResolvers';
import AppLoadingState from '~context/appLoadingState';
import { authenticate, clearToken } from '../../../api';

import ENS from '../../../lib/ENS';
import setupAdminSagas from '../../admin/sagas';
import setupDashboardSagas from '../../dashboard/sagas';
import { getWallet, setupUsersSagas } from '../../users/sagas/index';
import {
  getGasPrices,
  getColonyManager,
  rehydrateColonyClients,
} from './utils';
import setupOnBeforeUnload from './setupOnBeforeUnload';
import { setupUserBalanceListener } from './setupUserBalanceListener';

function* setupContextDependentSagas() {
  const appLoadingState: typeof AppLoadingState = AppLoadingState;
  yield all([
    call(setupAdminSagas),
    call(setupDashboardSagas),
    call(setupUsersSagas),
    /**
     * We've loaded all the context sagas, so we can proceed with redering
     * all the app's routes
     */
    call([appLoadingState, appLoadingState.setIsLoading], false),
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
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    let colonyClients = new Map();

    /*
     * Get the "old" wallet address, and if it's ethereal, remove it's authetication
     * token from local host as it won't be needed anymore
     */
    const {
      data: {
        loggedInUser: {
          walletAddress: etherealWalletAddress,
          ethereal: isWalletTypeEthereal,
        },
      },
    } = yield apolloClient.query<LoggedInUserQuery, LoggedInUserQueryVariables>(
      {
        query: LoggedInUserDocument,
      },
    );
    if (isWalletTypeEthereal && etherealWalletAddress) {
      clearToken(etherealWalletAddress);
    }

    /*
     * Get the new wallet and set it in context.
     */
    const wallet = yield call(getWallet, action);
    const walletAddress = createAddress(wallet.address);
    let walletNetworkId = '1';
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      walletNetworkId = window.ethereum.networkVersion;
    }
    /*
     * @NOTE Detecting Ganache via it's network id is a bit iffy
     * It's randomized on start so we can reliably count on it.
     *
     * For that, if the chainId is bigger then 10k, we assume we're on
     * ganache (on dev mode only), and set our own chainId to `13131313`
     *
     * We really need a better way of detecting ganache here, it will have to do
     * for now
     */
    if (
      process.env.NODE_ENV === 'development' &&
      parseInt(walletNetworkId, 10) > 10000
    ) {
      walletNetworkId = '13131313';
    }

    TEMP_setContext(ContextModule.Wallet, wallet);

    yield authenticate(wallet);

    yield put<AllActions>({
      type: ActionTypes.WALLET_CREATE_SUCCESS,
      payload: {
        walletType: method,
      },
    });

    yield call(setLastWallet, method, walletAddress);

    /*
     * If we have a colony manager set in context, get it's initialized colony clients
     *
     * Note that it won't exist if this is the first time loading the app, as it
     * gets set just after this try/catch block
     */
    try {
      const oldColonyManager = TEMP_getContext(ContextModule.ColonyManager);
      colonyClients = oldColonyManager.colonyClients;
    } catch (error) {
      /*
       * Silent error
       */
    }

    const colonyManager = yield call(getColonyManager);
    TEMP_setContext(ContextModule.ColonyManager, colonyManager);

    /*
     * Rehydrate the colony manage with (potentially) existing colony clients
     */
    yield rehydrateColonyClients(colonyClients);

    yield call(getGasPrices);

    const ens = TEMP_getContext(ContextModule.ENS);

    /*
     * This needs to happen first because USER_CONTEXT_SETUP_SUCCESS causes a redirect
     * to dashboard, which needs context for sagas which happen on load.
     * Forking is okay because each `takeEvery` etc happens immediately anyway,
     * but we then do not wait for a return value (which will never come).
     */
    yield fork(setupContextDependentSagas);

    /*
     * Get the network contract values from the resolver
     */
    yield updateNetworkContracts();

    // Start a forked task to listen for user balance events
    yield fork(setupUserBalanceListener, walletAddress);

    let username;
    try {
      const domain = yield ens.getDomain(
        walletAddress,
        colonyManager.networkClient,
      );
      username = ENS.stripDomainParts('user', domain);

      yield refetchUserNotifications(walletAddress);
    } catch (caughtError) {
      log.verbose(`Could not find username for ${walletAddress}`);
    }

    const balance = yield colonyManager.provider.getBalance(walletAddress);

    // @TODO refactor setupUserContext for graphql
    // @BODY eventually we want to move everything to resolvers, so all of this has to happen outside of sagas. There is no need to have a separate state or anything, just set it up in an aync function (instead of WALLET_CREATE), then call this function
    const ipfs = TEMP_getContext(ContextModule.IPFS);
    const pinataClient = TEMP_getContext(ContextModule.Pinata);
    const userContext = {
      apolloClient,
      colonyManager,
      ens,
      ipfs,
      wallet,
      pinataClient,
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
          ethereal: method === WalletMethod.Ethereal,
          networkId: parseInt(walletNetworkId, 10),
        },
      },
      /*
       * For some reason TS doesn't like that we don't pass any arguments
       * to the cache update function
       */
      // @ts-ignore
      update: cacheUpdates.setCanMintNativeToken(),
    });

    setupOnBeforeUnload();

    yield put<AllActions>({
      type: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    });
  } catch (caughtError) {
    return yield putError(ActionTypes.WALLET_CREATE_ERROR, caughtError, meta);
  }
  return null;
}
