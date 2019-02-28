/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  delay,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import type { Action } from '~redux';
import { getContext, CONTEXT } from '~context';
import {
  executeQuery,
  executeCommand,
  putError,
  takeFrom,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';
import { usernameSelector, currentUserAddressSelector } from '../selectors';
import {
  createUserProfile,
  removeUserAvatar,
  setUserAvatar,
  updateUserProfile,
} from '../../../data/service/commands/user';
import {
  checkUsernameIsAvailable,
  getUserBalance,
  getUserAvatar,
  getUsername,
  getUserProfile,
  getUserColonyTransactions,
} from '../../../data/service/queries';
import { createTransaction, getTxChannel } from '../../core/sagas/transactions';

function* userAvatarFetch({
  payload: { username },
}: Action<typeof ACTIONS.USER_AVATAR_FETCH>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      ipfsNode: yield* getContext(CONTEXT.IPFS_NODE),
      metadata: {
        username,
        walletAddress: yield select(currentUserAddressSelector),
      },
    };

    const avatar = yield* executeQuery(context, getUserAvatar);

    yield put<Action<typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS>>({
      type: ACTIONS.USER_AVATAR_FETCH_SUCCESS,
      payload: { username, avatar },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_AVATAR_FETCH_ERROR, error, { key: username });
  }
}

function* userFetchTokenTransfers(
  // eslint-disable-next-line no-unused-vars
  action: Action<typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS>,
): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const context = {
      // It shouldn't matter which colony client we use, so let's use the meta colony
      colonyClient: yield call([
        colonyManager,
        colonyManager.getMetaColonyClient,
      ]),
      metadata: {
        walletAddress: yield select(currentUserAddressSelector),
      },
    };
    const transactions = yield* executeQuery(
      context,
      getUserColonyTransactions,
    );
    yield put<Action<typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS>>({
      type: ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
      payload: { transactions },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_FETCH_TOKEN_TRANSFERS_ERROR, error);
  }
}

function* userProfileFetch({
  meta,
  payload: { username },
}: Action<typeof ACTIONS.USER_PROFILE_FETCH>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        username,
        walletAddress: yield select(currentUserAddressSelector),
      },
    };

    const user = yield* executeQuery(context, getUserProfile);

    yield put<Action<typeof ACTIONS.USER_PROFILE_FETCH_SUCCESS>>({
      type: ACTIONS.USER_PROFILE_FETCH_SUCCESS,
      meta,
      payload: user,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_PROFILE_FETCH_ERROR, error, meta);
  }
}

function* usernameFetch({
  payload: { userAddress },
}: Action<typeof ACTIONS.USERNAME_FETCH>): Saga<void> {
  try {
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const context = { networkClient };

    const username = yield* executeQuery(context, getUsername, userAddress);
    yield put<Action<typeof ACTIONS.USERNAME_FETCH_SUCCESS>>({
      type: ACTIONS.USERNAME_FETCH_SUCCESS,
      payload: { username, key: userAddress },
    });
  } catch (error) {
    yield putError(ACTIONS.USERNAME_FETCH_ERROR, error);
  }
}

function* currentUserGetBalance(
  // eslint-disable-next-line no-unused-vars
  action: Action<typeof ACTIONS.CURRENT_USER_GET_BALANCE>,
): Saga<void> {
  try {
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const context = {
      networkClient,
      metadata: { walletAddress: yield select(currentUserAddressSelector) },
    };

    const balance = yield* executeQuery(context, getUserBalance);

    yield put<Action<typeof ACTIONS.CURRENT_USER_GET_BALANCE_SUCCESS>>({
      type: ACTIONS.CURRENT_USER_GET_BALANCE_SUCCESS,
      payload: { balance },
    });
  } catch (error) {
    yield putError(ACTIONS.CURRENT_USER_GET_BALANCE_ERROR, error);
  }
}

function* userProfileUpdate({
  meta,
  payload,
}: Action<typeof ACTIONS.USER_PROFILE_UPDATE>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress: yield select(currentUserAddressSelector),
      },
    };

    yield* executeCommand(context, updateUserProfile, payload);

    const user = yield* executeQuery(context, getUserProfile);

    yield put<Action<typeof ACTIONS.USER_PROFILE_UPDATE_SUCCESS>>({
      type: ACTIONS.USER_PROFILE_UPDATE_SUCCESS,
      meta,
      payload: user,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_PROFILE_UPDATE_ERROR, error, meta);
  }
}

function* userRemoveAvatar({
  meta,
}: Action<typeof ACTIONS.USER_REMOVE_AVATAR>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        username: yield select(usernameSelector),
        walletAddress: yield select(currentUserAddressSelector),
      },
    };

    yield* executeCommand(context, removeUserAvatar);

    yield put<Action<typeof ACTIONS.USER_REMOVE_AVATAR_SUCCESS>>({
      type: ACTIONS.USER_REMOVE_AVATAR_SUCCESS,
      meta,
      payload: { username: context.metadata.username },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_REMOVE_AVATAR_ERROR, error, meta);
  }
}

function* userUploadAvatar({
  meta,
  payload,
}: Action<typeof ACTIONS.USER_UPLOAD_AVATAR>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      ipfsNode: yield* getContext(CONTEXT.IPFS_NODE),
      metadata: {
        walletAddress: yield select(currentUserAddressSelector),
      },
    };

    const hash = yield* executeCommand(context, setUserAvatar, payload);

    yield put<Action<typeof ACTIONS.USER_UPLOAD_AVATAR_SUCCESS>>({
      type: ACTIONS.USER_UPLOAD_AVATAR_SUCCESS,
      meta,
      payload: { hash },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_UPLOAD_AVATAR_ERROR, error, meta);
  }
}

function* usernameCheckAvailability({
  meta,
  payload: { username },
}: Action<typeof ACTIONS.USERNAME_CHECK_AVAILABILITY>): Saga<void> {
  try {
    yield delay(300);

    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const context = { networkClient };

    // This will throw if the username is not available
    yield* executeQuery(context, checkUsernameIsAvailable, username);

    yield put<Action<typeof ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS>>({
      type: ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    yield putError(ACTIONS.USERNAME_CHECK_AVAILABILITY_ERROR, error, meta);
  }
}

function* usernameCreate({
  meta,
  payload: { username },
}: Action<typeof ACTIONS.USERNAME_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const walletAddress = yield select(currentUserAddressSelector);
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        username,
        walletAddress,
      },
    };

    const { profileStore } = yield* executeCommand(context, createUserProfile, {
      username,
    });

    yield fork(createTransaction, meta.id, {
      context: NETWORK_CONTEXT,
      methodName: 'registerUserLabel',
      params: { username, orbitDBPath: profileStore.address.toString() },
    });

    const {
      payload,
    }: Action<typeof ACTIONS.TRANSACTION_CREATED> = yield takeFrom(
      txChannel,
      ACTIONS.TRANSACTION_CREATED,
    );
    yield put<Action<typeof ACTIONS.USERNAME_CREATE_SUCCESS>>({
      type: ACTIONS.USERNAME_CREATE_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.USERNAME_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* setupUsersSagas(): Saga<void> {
  yield takeEvery(ACTIONS.USER_AVATAR_FETCH, userAvatarFetch);
  yield takeEvery(ACTIONS.USER_FETCH_TOKEN_TRANSFERS, userFetchTokenTransfers);
  yield takeEvery(ACTIONS.USER_PROFILE_FETCH, userProfileFetch);
  yield takeEvery(ACTIONS.USERNAME_FETCH, usernameFetch);
  yield takeLatest(ACTIONS.CURRENT_USER_GET_BALANCE, currentUserGetBalance);
  yield takeLatest(ACTIONS.USER_PROFILE_UPDATE, userProfileUpdate);
  yield takeLatest(ACTIONS.USER_REMOVE_AVATAR, userRemoveAvatar);
  yield takeLatest(ACTIONS.USER_UPLOAD_AVATAR, userUploadAvatar);
  yield takeLatest(
    ACTIONS.USERNAME_CHECK_AVAILABILITY,
    usernameCheckAvailability,
  );
  yield takeLatest(ACTIONS.USERNAME_CREATE, usernameCreate);
}
