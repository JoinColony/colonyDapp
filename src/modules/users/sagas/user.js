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
import {
  walletAddressSelector,
  currentUserMetadataSelector,
} from '../selectors';

import { ipfsUpload } from '../../core/sagas/ipfs';

import {
  updateTokens,
  createUserProfile,
  removeUserAvatar,
  setUserAvatar,
  subscribeToColony,
  subscribeToTask,
  updateUserProfile,
} from '../data/commands';
import {
  checkUsernameIsAvailable,
  getUserBalance,
  getUserColonies,
  getUserColonyTransactions,
  getUserPermissions,
  getUserProfile,
  getUserTasks,
  getUserTokens,
  getUserMetadataStoreAddress,
} from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas/transactions';
import { userFetch as userFetchActionCreator } from '../actionCreators';

function* getUserMetadataStoreContext(): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const { metadataStoreAddress: userMetadataStoreAddress } = yield select(
    currentUserMetadataSelector,
  );
  return {
    ddb,
    wallet,
    metadata: {
      userMetadataStoreAddress,
      walletAddress: wallet.address,
    },
  };
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
        walletAddress: yield select(walletAddressSelector),
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
    yield put(userFetchActionCreator(address));
  } catch (error) {
    yield putError(ACTIONS.USER_FETCH_ERROR, error);
  }
}

function* userFetch({
  meta,
  payload: { userAddress },
}: Action<typeof ACTIONS.USER_FETCH>): Saga<void> {
  try {
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress: userAddress,
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
    const walletAddress = yield select(walletAddressSelector);

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
        walletAddress: yield select(walletAddressSelector),
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

function* userAvatarRemove({
  meta,
}: Action<typeof ACTIONS.USER_AVATAR_REMOVE>): Saga<void> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress,
      },
    };

    yield* executeCommand(context, removeUserAvatar);

    yield put<Action<typeof ACTIONS.USER_AVATAR_REMOVE_SUCCESS>>({
      type: ACTIONS.USER_AVATAR_REMOVE_SUCCESS,
      payload: { address: walletAddress },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_AVATAR_REMOVE_ERROR, error, meta);
  }
}

function* userAvatarUpload({
  meta,
  payload,
}: Action<typeof ACTIONS.USER_AVATAR_UPLOAD>): Saga<void> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const context = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress,
      },
    };

    const ipfsHash = yield call(ipfsUpload, payload.data);

    yield* executeCommand(context, setUserAvatar, { ipfsHash });

    yield put<Action<typeof ACTIONS.USER_AVATAR_UPLOAD_SUCCESS>>({
      type: ACTIONS.USER_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: {
        hash: ipfsHash,
        avatar: payload.data,
        address: walletAddress,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_AVATAR_UPLOAD_ERROR, error, meta);
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
    const walletAddress = yield select(walletAddressSelector);
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
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.USER_PERMISSIONS_FETCH>): Saga<void> {
  try {
    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );
    const walletAddress = yield select(walletAddressSelector);

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
      payload: { permissions, colonyAddress },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_PERMISSIONS_FETCH_ERROR, error, meta);
  }
}

function* getMetadataStoreAddress() {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const walletAddress = yield select(walletAddressSelector);
  return yield* executeQuery(
    {
      ddb,
      metadata: {
        walletAddress,
      },
    },
    getUserMetadataStoreAddress,
  );
}

function* userTokensFetch(): Saga<void> {
  try {
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const walletAddress = yield select(walletAddressSelector);
    const userMetadataStoreAddress = yield* getMetadataStoreAddress();
    const context = {
      ddb,
      networkClient,
      metadata: {
        walletAddress,
        userMetadataStoreAddress,
      },
    };
    const tokens = yield* executeQuery(context, getUserTokens);
    yield put<Action<typeof ACTIONS.USER_TOKENS_FETCH_SUCCESS>>({
      type: ACTIONS.USER_TOKENS_FETCH_SUCCESS,
      payload: { tokens },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_TOKENS_FETCH_ERROR, error);
  }
}

/**
 * Diff the current user tokens and the list sent as payload, and work out
 * which tokens need adding and which need removing. Then append the relevant
 * events to the user metadata store.
 */
function* userTokensUpdate(
  action: Action<typeof ACTIONS.USER_TOKENS_UPDATE>,
): Saga<void> {
  try {
    const { tokens } = action.payload;
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const walletAddress = yield select(walletAddressSelector);
    const userMetadataStoreAddress = yield* getMetadataStoreAddress();
    const context = {
      ddb,
      metadata: {
        walletAddress,
        userMetadataStoreAddress,
      },
    };

    yield* executeCommand(context, updateTokens, {
      tokens,
    });

    yield put({ type: ACTIONS.USER_TOKENS_FETCH });
    yield put({ type: ACTIONS.USER_TOKENS_UPDATE_SUCCESS });
  } catch (error) {
    yield putError(ACTIONS.USER_TOKENS_UPDATE_ERROR, error);
  }
}

function* userSubscribedColoniesFetch(): Saga<*> {
  try {
    const context = yield call(getUserMetadataStoreContext);
    const colonyAddresses = yield* executeQuery(context, getUserColonies);
    yield put<Action<typeof ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS>>({
      type: ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS,
      payload: colonyAddresses,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS, error);
  }
}

function* userColonySubscribe({
  payload,
}: Action<typeof ACTIONS.USER_COLONY_SUBSCRIBE>): Saga<*> {
  try {
    const context = yield call(getUserMetadataStoreContext);
    if (yield* executeCommand(context, subscribeToColony, payload)) {
      yield put<Action<typeof ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS>>({
        type: ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS,
        payload,
      });
    }
  } catch (error) {
    yield putError(ACTIONS.USER_COLONY_SUBSCRIBE_ERROR, error);
  }
}

function* userSubscribedTasksFetch(): Saga<*> {
  try {
    const context = yield call(getUserMetadataStoreContext);
    const userTasks = yield* executeQuery(context, getUserTasks);
    yield put<Action<typeof ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS>>({
      type: ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS,
      payload: userTasks,
    });
  } catch (error) {
    yield putError(ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_ERROR, error);
  }
}

function* userTaskSubscribe({
  payload,
}: Action<typeof ACTIONS.USER_TASK_SUBSCRIBE>): Saga<*> {
  try {
    const context = yield call(getUserMetadataStoreContext);
    if (yield* executeCommand(context, subscribeToTask, payload)) {
      yield put<Action<typeof ACTIONS.USER_TASK_SUBSCRIBE_SUCCESS>>({
        type: ACTIONS.USER_TASK_SUBSCRIBE_SUCCESS,
        payload,
      });
    }
  } catch (error) {
    yield putError(ACTIONS.USER_TASK_SUBSCRIBE_ERROR, error);
  }
}

export default function* setupUsersSagas(): Saga<void> {
  yield takeEvery(ACTIONS.USER_FETCH, userFetch);
  yield takeEvery(ACTIONS.USER_BY_USERNAME_FETCH, userByUsernameFetch);
  yield takeEvery(ACTIONS.USER_PERMISSIONS_FETCH, userPermissionsFetch);
  yield takeEvery(ACTIONS.USER_TOKEN_TRANSFERS_FETCH, userTokenTransfersFetch);
  yield takeEvery(ACTIONS.USER_TOKENS_FETCH, userTokensFetch);
  yield takeEvery(ACTIONS.USER_COLONY_SUBSCRIBE, userColonySubscribe);
  yield takeEvery(
    ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
    userSubscribedTasksFetch,
  );
  yield takeEvery(ACTIONS.USER_TASK_SUBSCRIBE, userTaskSubscribe);
  yield takeEvery(
    ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH,
    userSubscribedColoniesFetch,
  );

  yield takeLatest(
    ACTIONS.USERNAME_CHECK_AVAILABILITY,
    usernameCheckAvailability,
  );
  yield takeLatest(ACTIONS.USERNAME_CREATE, usernameCreate);
  yield takeLatest(ACTIONS.CURRENT_USER_GET_BALANCE, currentUserGetBalance);
  yield takeLatest(ACTIONS.USER_PROFILE_UPDATE, userProfileUpdate);
  yield takeLatest(ACTIONS.USER_AVATAR_REMOVE, userAvatarRemove);
  yield takeLatest(ACTIONS.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ACTIONS.USER_TOKENS_UPDATE, userTokensUpdate);
}
