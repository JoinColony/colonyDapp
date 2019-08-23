import { push } from 'connected-react-router';

import {
  call,
  delay,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
  setContext,
  all,
} from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { getContext, Context } from '~context/index';
import ENS from '~lib/ENS';

import { getUserProfileStoreAddress } from '../../../data/stores';

import {
  executeQuery,
  executeCommand,
  executeSubscription,
  putError,
  selectAsJS,
  takeFrom,
} from '~utils/saga/effects';

import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';
import {
  walletAddressSelector,
  currentUserMetadataSelector,
  userColoniesSelector,
} from '../selectors';

import { ipfsUpload } from '../../core/sagas/ipfs';
import {
  transactionAddParams,
  transactionReady,
  transactionLoadRelated,
} from '../../core/actionCreators';

import {
  createUserProfile,
  updateTokens,
  removeUserAvatar,
  setUserAvatar,
  subscribeToColony,
  subscribeToTask,
  updateUserProfile,
  unsubscribeToColony,
} from '../data/commands';
import {
  checkUsernameIsAvailable,
  getUserAddress,
  getUserBalance,
  getUserColonies,
  getUserColonyTransactions,
  getUserPermissions,
  getUserProfile,
  getUserTasks,
  getUserTokens,
  getUserInboxActivity,
  getUserNotificationMetadata,
  subscribeToUser,
  subscribeToUserTasks,
  subscribeToUserColonies,
} from '../data/queries';

import { createTransaction, getTxChannel } from '../../core/sagas/transactions';

function* userTokenTransfersFetch( // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  action: Action<ActionTypes.USER_TOKEN_TRANSFERS_FETCH>,
) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const userColonyAddresses = yield selectAsJS(
      userColoniesSelector,
      walletAddress,
    );
    const transactions = yield executeQuery(getUserColonyTransactions, {
      args: {
        walletAddress,
        userColonyAddresses:
          (userColonyAddresses && userColonyAddresses.record) || [],
      },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_TOKEN_TRANSFERS_FETCH_SUCCESS,
      payload: { transactions },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_TOKEN_TRANSFERS_FETCH_ERROR, error);
  }
  return null;
}

function* userAddressFetch({
  payload: { username },
  meta,
}: Action<ActionTypes.USER_ADDRESS_FETCH>) {
  try {
    const userAddress = yield executeQuery(getUserAddress, {
      args: { username },
    });

    yield put({
      type: ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
      payload: { userAddress },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_ADDRESS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* userFetch({
  meta,
  payload: { userAddress },
}: Action<ActionTypes.USER_FETCH>) {
  try {
    const user = yield executeQuery(getUserProfile, {
      metadata: {
        walletAddress: userAddress,
      },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_FETCH_SUCCESS,
      meta,
      payload: user,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_FETCH_ERROR, error, meta);
  }
  return null;
}

function* currentUserGetBalance( // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  action: Action<ActionTypes.CURRENT_USER_GET_BALANCE>,
) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    if (!walletAddress) {
      throw new Error('Could not get wallet address for current user');
    }

    const balance = yield executeQuery(getUserBalance, {
      args: { walletAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.CURRENT_USER_GET_BALANCE_SUCCESS,
      payload: { balance },
    });
  } catch (error) {
    return yield putError(ActionTypes.CURRENT_USER_GET_BALANCE_ERROR, error);
  }
  return null;
}

function* userProfileUpdate({
  meta,
  payload,
}: Action<ActionTypes.USER_PROFILE_UPDATE>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    yield executeCommand(updateUserProfile, {
      metadata: {
        walletAddress,
      },
      args: payload,
    });

    const user = yield executeQuery(getUserProfile, {
      metadata: {
        walletAddress,
      },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_PROFILE_UPDATE_SUCCESS,
      meta,
      payload: user,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_PROFILE_UPDATE_ERROR, error, meta);
  }
  return null;
}

function* userAvatarRemove({ meta }: Action<ActionTypes.USER_AVATAR_REMOVE>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    yield executeCommand(removeUserAvatar, {
      metadata: {
        walletAddress,
      },
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
    const walletAddress = yield select(walletAddressSelector);
    const ipfsHash = yield call(ipfsUpload, payload.data);
    yield executeCommand(setUserAvatar, {
      metadata: {
        walletAddress,
      },
      args: { ipfsHash },
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

function* usernameCheckAvailability({
  meta,
  payload: { username },
}: Action<ActionTypes.USERNAME_CHECK_AVAILABILITY>) {
  try {
    yield delay(300);

    const isAvailable = yield executeQuery(checkUsernameIsAvailable, {
      args: { username },
    });

    if (!isAvailable) {
      throw new Error(`ENS address for user "${username}" already exists`);
    }

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CHECK_AVAILABILITY_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.USERNAME_CHECK_AVAILABILITY_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* usernameCreate({
  meta: { id },
  meta,
  payload: { username: givenUsername },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const txChannel = yield call(getTxChannel, id);
  try {
    // Normalize again, just to be sure
    const username = ENS.normalize(givenUsername);

    yield fork(createTransaction, id, {
      context: NETWORK_CONTEXT,
      methodName: 'registerUserLabel',
      ready: false,
      params: { username },
      group: {
        key: 'transaction.batch.createUser',
        id,
        index: 0,
      },
    });

    const walletAddress = yield select(walletAddressSelector);

    const ddb = yield getContext(Context.DDB_INSTANCE);

    const getAddress = yield call(getUserProfileStoreAddress, ddb);
    const profileStoreAddress = yield call(getAddress, { walletAddress });

    const orbitDBPath = profileStoreAddress.toString();
    yield put(transactionAddParams(id, { orbitDBPath }));
    yield put(transactionReady(id));

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionLoadRelated(id, true));

    const { metadataStore, inboxStore } = yield executeCommand(
      createUserProfile,
      {
        args: { username, walletAddress },
        metadata: { walletAddress },
      },
    );

    yield put(transactionLoadRelated(id, false));

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        inboxStoreAddress: inboxStore.address.toString(),
        metadataStoreAddress: metadataStore.address.toString(),
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
  const ddb = yield getContext(Context.DDB_INSTANCE);

  try {
    /*
     *  1. Destroy instances of colonyJS in the colonyManager? Probably.
     */
    yield setContext({
      [Context.COLONY_MANAGER]: undefined,
    });

    /*
     *  2. The purser wallet is reset
     */
    yield setContext({ [Context.WALLET]: undefined });

    /*
     *  3. Close orbit store
     */
    yield call([ddb, ddb.stop]);

    yield all([
      put<AllActions>({
        type: ActionTypes.USER_LOGOUT_SUCCESS,
      }),
      put(push(`/dashboard`)),
    ]);
  } catch (error) {
    return yield putError(ActionTypes.USER_LOGOUT_ERROR, error);
  }
  return null;
}

function* userPermissionsFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.USER_PERMISSIONS_FETCH>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    if (!walletAddress) {
      throw new Error('Could not get wallet address for current user');
    }
    const permissions = yield executeQuery(getUserPermissions, {
      metadata: { colonyAddress },
      args: { walletAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_PERMISSIONS_FETCH_SUCCESS,
      payload: { permissions, colonyAddress },
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.USER_PERMISSIONS_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* userTokensFetch() {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    const tokens = yield executeQuery(getUserTokens, {
      metadata,
      args: {
        walletAddress,
      },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_TOKENS_FETCH_SUCCESS,
      payload: { tokens },
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_TOKENS_FETCH_ERROR, error);
  }
  return null;
}

/**
 * Diff the current user tokens and the list sent as payload, and work out
 * which tokens need adding and which need removing. Then append the relevant
 * events to the user metadata store.
 */
function* userTokensUpdate(action: Action<ActionTypes.USER_TOKENS_UPDATE>) {
  try {
    const { tokens } = action.payload;
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    yield executeCommand(updateTokens, {
      metadata,
      args: { tokens },
    });

    yield put({ type: ActionTypes.USER_TOKENS_FETCH });
    yield put({ type: ActionTypes.USER_TOKENS_UPDATE_SUCCESS });
  } catch (error) {
    return yield putError(ActionTypes.USER_TOKENS_UPDATE_ERROR, error);
  }
  return null;
}

function* userSubscribedColoniesFetch(
  action: Action<ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH>,
) {
  try {
    const {
      payload: { walletAddress, metadataStoreAddress },
      meta,
    } = action;
    const colonyAddresses = yield executeQuery(getUserColonies, {
      metadata: {
        walletAddress,
        metadataStoreAddress,
      },
    });
    yield put<AllActions>({
      type: ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS,
      payload: { walletAddress, colonyAddresses },
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS,
      error,
    );
  }
  return null;
}

function* userColonySubscribe({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.USER_COLONY_SUBSCRIBE>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    const userColonyAddresses = yield executeQuery(getUserColonies, {
      metadata,
    });
    yield executeCommand(subscribeToColony, {
      args: { colonyAddress, userColonyAddresses },
      metadata,
    });
    yield put<AllActions>({
      type: ActionTypes.USER_COLONY_SUBSCRIBE_SUCCESS,
      payload: { colonyAddress, walletAddress },
      meta,
    });
  } catch (caughtError) {
    return yield putError(
      ActionTypes.USER_COLONY_SUBSCRIBE_ERROR,
      caughtError,
      meta,
    );
  }
  return null;
}

function* userColonyUnsubscribe({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.USER_COLONY_UNSUBSCRIBE>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    const userColonyAddresses = yield executeQuery(getUserColonies, {
      metadata,
    });

    yield executeCommand(unsubscribeToColony, {
      args: { colonyAddress, userColonyAddresses },
      metadata,
    });
    yield put<AllActions>({
      type: ActionTypes.USER_COLONY_UNSUBSCRIBE_SUCCESS,
      payload: { colonyAddress, walletAddress },
      meta,
    });
  } catch (caughtError) {
    return yield putError(
      ActionTypes.USER_COLONY_UNSUBSCRIBE_ERROR,
      caughtError,
      meta,
    );
  }
  return null;
}

function* userSubscribedTasksFetch() {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    const userTasks = yield executeQuery(getUserTasks, {
      metadata,
    });
    yield put<AllActions>({
      type: ActionTypes.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS,
      payload: userTasks,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_SUBSCRIBED_TASKS_FETCH_ERROR, error);
  }
  return null;
}

function* userTaskSubscribe({
  payload,
}: Action<ActionTypes.USER_TASK_SUBSCRIBE>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    const userDraftIds = yield executeQuery(getUserTasks, {
      metadata,
    });
    if (
      yield executeCommand(subscribeToTask, {
        args: { ...payload, userDraftIds },
        metadata,
      })
    ) {
      yield put<AllActions>({
        type: ActionTypes.USER_TASK_SUBSCRIBE_SUCCESS,
        payload,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.USER_TASK_SUBSCRIBE_ERROR, error);
  }
  return null;
}

function* inboxItemsFetch({ meta }: Action<ActionTypes.INBOX_ITEMS_FETCH>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { inboxStoreAddress, metadataStoreAddress } = yield select(
      currentUserMetadataSelector,
    );

    if (!(inboxStoreAddress && metadataStoreAddress)) return null;

    const userColonies = yield executeQuery(getUserColonies, {
      metadata: {
        walletAddress,
        metadataStoreAddress,
      },
    });

    const { readUntil = 0, exceptFor = [] } = yield executeQuery(
      getUserNotificationMetadata,
      {
        metadata: {
          walletAddress,
          metadataStoreAddress,
        },
      },
    );

    // @todo (reactivity) Make metadata and user inbox data reactive
    yield put<AllActions>({
      type: ActionTypes.USER_NOTIFICATION_METADATA_FETCH_SUCCESS,
      payload: {
        readUntil,
        exceptFor,
      },
    });

    const activities = yield executeQuery(getUserInboxActivity, {
      metadata: { inboxStoreAddress, walletAddress, userColonies },
    });

    yield put<AllActions>({
      type: ActionTypes.INBOX_ITEMS_FETCH_SUCCESS,
      payload: { activities },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.INBOX_ITEMS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* userSubStart({
  meta,
  payload: { userAddress },
}: Action<ActionTypes.USER_SUB_START>) {
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToUser, {
      metadata: { walletAddress: userAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.USER_SUB_STOP &&
          action.payload.userAddress === userAddress,
      );
      channel.close();
    });

    while (true) {
      const userProfile = yield take(channel);
      yield put({
        type: ActionTypes.USER_SUB_EVENTS,
        meta,
        payload: userProfile,
      });
    }
  } catch (caughtError) {
    return yield putError(ActionTypes.USER_SUB_ERROR, caughtError, meta);
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

function* userSubscribedTasksSubStart() {
  const walletAddress = yield select(walletAddressSelector);
  const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToUserTasks, {
      metadata: { walletAddress, metadataStoreAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action => action.type === ActionTypes.USER_SUBSCRIBED_TASKS_SUB_STOP,
      );
      channel.close();
    });

    while (true) {
      const userTasks = yield take(channel);
      yield put({
        type: ActionTypes.USER_SUBSCRIBED_TASKS_SUB_EVENTS,
        payload: userTasks,
      });
    }
  } catch (caughtError) {
    return yield putError(
      ActionTypes.USER_SUBSCRIBED_TASKS_SUB_ERROR,
      caughtError,
    );
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

function* userSubscribedColoniesSubStart({
  meta,
  payload: { walletAddress, metadataStoreAddress },
}: Action<ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_START>) {
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToUserColonies, {
      metadata: { walletAddress, metadataStoreAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_STOP &&
          action.payload.walletAddress === walletAddress,
      );
      channel.close();
    });

    while (true) {
      const colonyAddresses = yield take(channel);
      yield put({
        type: ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_EVENTS,
        meta,
        payload: {
          colonyAddresses,
          walletAddress,
        },
      });
    }
  } catch (caughtError) {
    return yield putError(
      ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_ERROR,
      caughtError,
      meta,
    );
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

/* eslint-disable max-len,prettier/prettier */
export function* setupUsersSagas() {
  yield takeEvery(ActionTypes.INBOX_ITEMS_FETCH, inboxItemsFetch);
  yield takeEvery(ActionTypes.USER_ADDRESS_FETCH, userAddressFetch);
  yield takeEvery(ActionTypes.USER_COLONY_SUBSCRIBE, userColonySubscribe);
  yield takeEvery(ActionTypes.USER_COLONY_SUBSCRIBE, userColonySubscribe);
  yield takeEvery(ActionTypes.USER_COLONY_UNSUBSCRIBE, userColonyUnsubscribe);
  yield takeEvery(ActionTypes.USER_COLONY_UNSUBSCRIBE, userColonyUnsubscribe);
  yield takeEvery(ActionTypes.USER_FETCH, userFetch);
  yield takeEvery(ActionTypes.USER_PERMISSIONS_FETCH, userPermissionsFetch);
  yield takeEvery(ActionTypes.USER_SUB_START, userSubStart);
  yield takeEvery(ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH, userSubscribedColoniesFetch);
  yield takeEvery(ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_START, userSubscribedColoniesSubStart);
  yield takeEvery(ActionTypes.USER_SUBSCRIBED_TASKS_FETCH, userSubscribedTasksFetch);
  yield takeEvery(ActionTypes.USER_SUBSCRIBED_TASKS_SUB_START, userSubscribedTasksSubStart);
  yield takeEvery(ActionTypes.USER_TASK_SUBSCRIBE, userTaskSubscribe);
  yield takeEvery(ActionTypes.USER_TOKEN_TRANSFERS_FETCH, userTokenTransfersFetch);
  yield takeEvery(ActionTypes.USER_TOKEN_TRANSFERS_FETCH, userTokenTransfersFetch);
  yield takeEvery(ActionTypes.USER_TOKENS_FETCH, userTokensFetch);
  yield takeEvery(ActionTypes.USER_TOKENS_FETCH, userTokensFetch);
  yield takeLatest(ActionTypes.USERNAME_CHECK_AVAILABILITY, usernameCheckAvailability);
  yield takeLatest(ActionTypes.CURRENT_USER_GET_BALANCE, currentUserGetBalance);
  yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USER_PROFILE_UPDATE, userProfileUpdate);
  yield takeLatest(ActionTypes.USER_TOKENS_UPDATE, userTokensUpdate);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
}
/* eslint-enable max-len,prettier/prettier */
