import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  TEMP_getContext,
  ContextModule,
  TEMP_removeContext,
} from '~context/index';
import ENS from '~lib/ENS';
import {
  getLoggedInUser,
  // refetchUserNotifications,
  SetLoggedInUserMutation,
  SetLoggedInUserMutationVariables,
  SetLoggedInUserDocument,
  ClearLoggedInUserDocument,
  ClearLoggedInUserMutation,
  ClearLoggedInUserMutationVariables,
} from '~data/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { clearLastWallet } from '~utils/autoLogin';

import { clearToken } from '../../../api/auth';
import { transactionLoadRelated } from '../../core/actionCreators';
import { createTransaction, getTxChannel } from '../../core/sagas/transactions';
import { createUserWithSecondAttempt } from './utils';

function* usernameCreate({
  meta: { id },
  meta,
  payload: { username: givenUsername },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const txChannel = yield call(getTxChannel, id);
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  try {
    // Normalize again, just to be sure
    const username = ENS.normalize(givenUsername);

    yield fork(createTransaction, id, {
      context: ClientType.NetworkClient,
      methodName: 'registerUserLabel',
      ready: true,
      params: [username, ''],
      group: {
        key: 'transaction.batch.createUser',
        id,
        index: 0,
      },
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionLoadRelated(id, true));

    yield createUserWithSecondAttempt(username);

    yield put(transactionLoadRelated(id, false));

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        username,
      },
      meta,
    });

    /*
     * Set the logged in user and freshly created one
     */
    yield apolloClient.mutate<
      SetLoggedInUserMutation,
      SetLoggedInUserMutationVariables
    >({
      mutation: SetLoggedInUserDocument,
      variables: {
        input: {
          username,
        },
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.USERNAME_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* userLogout() {
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const { walletAddress } = yield getLoggedInUser();
    /*
     *  1. Destroy instances of colonyJS in the colonyManager? Probably.
     */
    // TEMP_removeContext(ContextModule.ColonyManager);

    /*
     *  2. The purser wallet is reset
     */
    TEMP_removeContext(ContextModule.Wallet);

    /*
     *  3. Delete json web token and last wallet from localstorage
     */
    clearToken(walletAddress);
    clearLastWallet();

    /*
     *  4. Clear the currently logged in user
     */
    yield apolloClient.mutate<
      ClearLoggedInUserMutation,
      ClearLoggedInUserMutationVariables
    >({
      mutation: ClearLoggedInUserDocument,
    });

    yield put<AllActions>({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_LOGOUT_ERROR, error);
  }
  return null;
}

export function* setupUsersSagas() {
  // yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  // yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
  // yield takeLatest(ActionTypes.USER_DEPOSIT_TOKEN, userDepositToken);
  // yield takeLatest(ActionTypes.USER_WITHDRAW_TOKEN, userWithdrawToken);
}
