import { call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { ClientType, TokenLockingClient } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  TEMP_getContext,
  ContextModule,
  TEMP_removeContext,
} from '~context/index';
import ENS from '~lib/ENS';
import { createAddress } from '~utils/web3';
import {
  getLoggedInUser,
  refetchUserNotifications,
  CreateUserDocument,
  CreateUserMutation,
  CreateUserMutationVariables,
  EditUserDocument,
  EditUserMutation,
  EditUserMutationVariables,
  ClearLoggedInUserDocument,
  ClearLoggedInUserMutation,
  ClearLoggedInUserMutationVariables,
  UserBalanceWithLockDocument,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
} from '~data/index';
import { putError, takeFrom } from '~utils/saga/effects';

import { clearToken } from '../../../api/auth';
import { ipfsUpload } from '../../core/sagas/ipfs';
import {
  transactionLoadRelated,
  transactionReady,
} from '../../core/actionCreators';
import {
  createTransactionChannels,
  createTransaction,
  getTxChannel,
} from '../../core/sagas/transactions';
import { clearLastWallet } from '~utils/autoLogin';

function* userAddressFetch({
  payload: { username },
  meta,
}: Action<ActionTypes.USER_ADDRESS_FETCH>) {
  try {
    const ens = TEMP_getContext(ContextModule.ENS);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    const address = yield ens.getAddress(
      ENS.getFullDomain('user', username),
      colonyManager.networkClient,
    );

    yield put({
      type: ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
      payload: { userAddress: createAddress(address) },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_ADDRESS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* userAvatarRemove({ meta }: Action<ActionTypes.USER_AVATAR_REMOVE>) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
      mutation: EditUserDocument,
      variables: { input: { avatarHash: null } },
    });

    yield put<AllActions>({
      type: ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
      payload: { address: walletAddress },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_AVATAR_REMOVE_ERROR, error, meta);
  }
  return null;
}

function* userAvatarUpload({
  meta,
  payload,
}: Action<ActionTypes.USER_AVATAR_UPLOAD>) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    let ipfsHash = null;
    if (payload.data) {
      try {
        ipfsHash = yield call(
          ipfsUpload,
          JSON.stringify({ image: payload.data }),
        );
      } catch (error) {
        // silent error
      }
    }

    yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
      mutation: EditUserDocument,
      variables: { input: { avatarHash: ipfsHash } },
    });

    yield put<AllActions>({
      type: ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: {
        hash: ipfsHash,
        avatar: payload.data,
        address: walletAddress,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_AVATAR_UPLOAD_ERROR, error, meta);
  }
  return null;
}

function* usernameCreate({
  meta: { id },
  meta,
  payload: { username: givenUsername },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const { walletAddress } = yield getLoggedInUser();
  const txChannel = yield call(getTxChannel, id);
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

    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionLoadRelated(id, true));

    yield apolloClient.mutate<CreateUserMutation, CreateUserMutationVariables>({
      mutation: CreateUserDocument,
      variables: {
        createUserInput: { username },
        loggedInUserInput: { username },
      },
    });

    yield put(transactionLoadRelated(id, false));

    yield refetchUserNotifications(walletAddress);

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        username,
      },
      meta,
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
    TEMP_removeContext(ContextModule.ColonyManager);

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

function* userDepositToken({
  meta,
  payload: { tokenAddress, amount, colonyAddress },
}: Action<ActionTypes.USER_DEPOSIT_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const { walletAddress } = yield getLoggedInUser();

    // eslint-disable-next-line max-len
    const tokenLockingClient: TokenLockingClient = yield colonyManager.getClient(
      ClientType.TokenLockingClient,
      colonyAddress,
    );

    const batchKey = 'deposit';

    const { approve, deposit } = yield createTransactionChannels(meta.id, [
      'approve',
      'deposit',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(approve, {
      context: ClientType.TokenClient,
      methodName: 'approve',
      identifier: colonyAddress,
      params: [tokenLockingClient.address, amount],
      ready: false,
    });

    yield createGroupTransaction(deposit, {
      context: ClientType.TokenLockingClient,
      methodName: 'deposit',
      identifier: colonyAddress,
      params: [tokenAddress, amount, false],
      ready: false,
    });

    yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(approve.id));

    yield takeFrom(approve.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(deposit.id));

    yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield apolloClient.query<
      UserBalanceWithLockQuery,
      UserBalanceWithLockQueryVariables
    >({
      query: UserBalanceWithLockDocument,
      variables: {
        address: walletAddress,
        tokenAddress,
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.USER_DEPOSIT_TOKEN_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_DEPOSIT_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* userWithdrawToken({
  meta,
  payload: { tokenAddress, amount, colonyAddress },
}: Action<ActionTypes.USER_WITHDRAW_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const { walletAddress } = yield getLoggedInUser();

    const { withdraw } = yield createTransactionChannels(meta.id, ['withdraw']);

    yield fork(createTransaction, withdraw.id, {
      context: ClientType.TokenLockingClient,
      methodName: 'withdraw',
      identifier: colonyAddress,
      params: [tokenAddress, amount, false],
      ready: false,
      group: {
        key: 'withdraw',
        id: meta.id,
        index: 0,
      },
    });

    yield takeFrom(withdraw.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(withdraw.id));

    yield takeFrom(withdraw.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield apolloClient.query<
      UserBalanceWithLockQuery,
      UserBalanceWithLockQueryVariables
    >({
      query: UserBalanceWithLockDocument,
      variables: {
        address: walletAddress,
        tokenAddress,
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.USER_WITHDRAW_TOKEN_SUCCESS,
      meta,
      payload: {
        tokenAddress,
        amount,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_WITHDRAW_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export function* setupUsersSagas() {
  yield takeEvery(ActionTypes.USER_ADDRESS_FETCH, userAddressFetch);
  yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
  yield takeLatest(ActionTypes.USER_DEPOSIT_TOKEN, userDepositToken);
  yield takeLatest(ActionTypes.USER_WITHDRAW_TOKEN, userWithdrawToken);
}
