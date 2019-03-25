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
import { currentUserAddressSelector } from '../selectors';
import {
  createUserProfile,
  removeUserAvatar,
  setUserAvatar,
  updateUserProfile,
} from '../../../data/service/commands/user';
import {
  checkUsernameIsAvailable,
  getUserAvatar,
  getUserBalance,
  getUserColonyTransactions,
  getUserPermissions,
  getUserProfile,
} from '../../../data/service/queries';
import { createTransaction, getTxChannel } from '../../core/sagas/transactions';

function* userAvatarFetch({
  meta,
  payload: { address },
}: Action<typeof ACTIONS.USER_AVATAR_FETCH>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      ipfsNode: yield* getContext(CONTEXT.IPFS_NODE),
      metadata: {
        walletAddress: address,
      },
    };

    const avatar = yield* executeQuery(context, getUserAvatar);

    yield put<Action<typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS>>({
      type: ACTIONS.USER_AVATAR_FETCH_SUCCESS,
      meta,
      payload: { address, avatar },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_AVATAR_FETCH_ERROR, error, meta);
  }
}

function* userTokenTransfersFetch(
  // eslint-disable-next-line no-unused-vars
  action: Action<typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH>,
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
    yield put<Action<typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH_SUCCESS>>({
      type: ACTIONS.USER_TOKEN_TRANSFERS_FETCH_SUCCESS,
      payload: { transactions },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_TOKEN_TRANSFERS_FETCH_ERROR, error);
  }
}

function* userByUsernameFetch({
  payload: { username },
}: Action<typeof ACTIONS.USER_BY_USERNAME_FETCH>): Saga<void> {
  try {
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const ensCache = yield* getContext(CONTEXT.ENS_INSTANCE);

    const address = yield call(
      [ensCache, ensCache.getAddress],
      ensCache.constructor.getFullDomain('user', username),
      networkClient,
    );
    // Construct meta here, as we don't have it yet when we call the action creator
    const meta = { keyPath: [address] };
    yield call(userFetch, {
      type: ACTIONS.USER_FETCH,
      meta,
      payload: { address },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_FETCH_ERROR, error);
  }
}

function* userFetch({
  meta,
  payload: { address },
}: Action<typeof ACTIONS.USER_FETCH>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress: address,
      },
    };

    const user = yield* executeQuery(context, getUserProfile);

    yield put<Action<typeof ACTIONS.USER_FETCH_SUCCESS>>({
      type: ACTIONS.USER_FETCH_SUCCESS,
      meta,
      payload: user,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_FETCH_ERROR, error, meta);
  }
}

function* currentUserGetBalance(
  // eslint-disable-next-line no-unused-vars
  action: Action<typeof ACTIONS.CURRENT_USER_GET_BALANCE>,
): Saga<void> {
  try {
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const context = { networkClient };
    const walletAddress = yield select(currentUserAddressSelector);

    if (!walletAddress) {
      throw new Error('Could not get wallet address for current user');
    }

    const balance = yield* executeQuery(context, getUserBalance, walletAddress);

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
    const address = yield select(currentUserAddressSelector);
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress: address,
      },
    };

    yield* executeCommand(context, removeUserAvatar);

    yield put<Action<typeof ACTIONS.USER_REMOVE_AVATAR_SUCCESS>>({
      type: ACTIONS.USER_REMOVE_AVATAR_SUCCESS,
      meta,
      payload: { address },
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
    const address = yield select(currentUserAddressSelector);
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      ipfsNode: yield* getContext(CONTEXT.IPFS_NODE),
      metadata: {
        walletAddress: address,
      },
    };

    const hash = yield* executeCommand(context, setUserAvatar, payload);

    yield put<Action<typeof ACTIONS.USER_UPLOAD_AVATAR_SUCCESS>>({
      type: ACTIONS.USER_UPLOAD_AVATAR_SUCCESS,
      meta,
      payload: { hash, avatar: payload.data, address },
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
    const ensCache = yield* getContext(CONTEXT.ENS_INSTANCE);
    const context = { ensCache, networkClient };

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

    // TODO should these stores be created after the transaction succeeded?
    const { profileStore, inboxStore, metadataStore } = yield* executeCommand(
      context,
      createUserProfile,
      {
        username,
      },
    );
    yield put<Action<typeof ACTIONS.USER_METADATA_SET>>({
      type: ACTIONS.USER_METADATA_SET,
      payload: {
        inboxStoreAddress: inboxStore.address.toString(),
        metadataStoreAddress: metadataStore.address.toString(),
        profileStoreAddress: profileStore.address.toString(),
      },
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

function* userPermissionsFetch({
  payload: { ensName },
  meta,
}: Action<typeof ACTIONS.USER_PERMISSIONS_FETCH>): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      ensName,
    );
    const walletAddress = yield select(currentUserAddressSelector);

    if (!walletAddress) {
      throw new Error('Could not get wallet address for current user');
    }

    const context = { colonyClient };
    const permissions = yield* executeQuery(
      context,
      getUserPermissions,
      walletAddress,
    );

    yield put<Action<typeof ACTIONS.USER_PERMISSIONS_FETCH_SUCCESS>>({
      type: ACTIONS.USER_PERMISSIONS_FETCH_SUCCESS,
      payload: { permissions, ensName },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_PERMISSIONS_FETCH_ERROR, error, meta);
  }
}

export default function* setupUsersSagas(): Saga<void> {
  yield takeEvery(ACTIONS.USER_AVATAR_FETCH, userAvatarFetch);
  yield takeEvery(ACTIONS.USER_FETCH, userFetch);
  yield takeEvery(ACTIONS.USER_BY_USERNAME_FETCH, userByUsernameFetch);
  yield takeEvery(ACTIONS.USER_PERMISSIONS_FETCH, userPermissionsFetch);
  yield takeEvery(ACTIONS.USER_TOKEN_TRANSFERS_FETCH, userTokenTransfersFetch);
  yield takeLatest(
    ACTIONS.USERNAME_CHECK_AVAILABILITY,
    usernameCheckAvailability,
  );
  yield takeLatest(ACTIONS.USERNAME_CREATE, usernameCreate);
  yield takeLatest(ACTIONS.CURRENT_USER_GET_BALANCE, currentUserGetBalance);
  yield takeLatest(ACTIONS.USER_PROFILE_UPDATE, userProfileUpdate);
  yield takeLatest(ACTIONS.USER_REMOVE_AVATAR, userRemoveAvatar);
  yield takeLatest(ACTIONS.USER_UPLOAD_AVATAR, userUploadAvatar);
}
