/* @flow */

import type { Saga } from 'redux-saga';
import { delay } from 'redux-saga';

import {
  call,
  put,
  select,
  getContext,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';

import type { Action, Address } from '~types';
import type { UserProfileProps } from '~immutable';

import { putError } from '~utils/saga/effects';
import { getHashedENSDomainString } from '~utils/ens';

import { DDB } from '../../../lib/database';
import { FeedStore, KVStore } from '../../../lib/database/stores';
import { getAll } from '../../../lib/database/commands';
import { getNetworkMethod } from '../../core/sagas/utils';
import { joinedColonyEvent } from '../../dashboard/components/UserActivities';
import {
  userActivitiesStoreAddressSelector,
  userProfileStoreAddressSelector,
  walletAddressSelector,
} from '../selectors';
import {
  userActivitiesStore,
  userInboxStore,
  userProfileStore,
} from '../stores';

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
  USER_PROFILE_FETCH_ERROR,
  USER_ACTIVITIES_FETCH,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_ACTIVITIES_FETCH_ERROR,
  USER_ACTIVITIES_UPDATE,
  USER_ACTIVITIES_UPDATE_SUCCESS,
  USER_ACTIVITIES_UPDATE_ERROR,
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
  USERNAME_VALIDATE,
  USERNAME_VALIDATE_SUCCESS,
  USERNAME_VALIDATE_ERROR,
  USERNAME_CREATE,
  USER_AVATAR_FETCH,
  USER_AVATAR_FETCH_SUCCESS,
  USER_AVATAR_FETCH_ERROR,
  USER_UPLOAD_AVATAR,
  USER_UPLOAD_AVATAR_SUCCESS,
  USER_UPLOAD_AVATAR_ERROR,
  USER_REMOVE_AVATAR,
  USER_REMOVE_AVATAR_SUCCESS,
  USER_REMOVE_AVATAR_ERROR,
} from '../actionTypes';
import { registerUserLabel } from '../actionCreators';

export function* getOrCreateUserStore(walletAddress: Address): Saga<KVStore> {
  const ddb: DDB = yield getContext('ddb');

  let profileStore;
  profileStore = yield call(
    [ddb, ddb.getStore],
    userProfileStore,
    `user.${walletAddress}`,
    {
      walletAddress,
    },
  );

  if (profileStore) {
    // TODO: handle return value of load
    yield call([profileStore, profileStore.load]);
    return profileStore;
  }

  profileStore = yield call([ddb, ddb.createStore], userProfileStore, {
    walletAddress,
  });

  const activitiesStore = yield call(
    [ddb, ddb.createStore],
    userActivitiesStore,
    {
      walletAddress,
    },
  );
  // @TODO: Should we merge those stores into a single event store and their content with contract events using selectors?
  yield call([activitiesStore, activitiesStore.add], joinedColonyEvent());

  const inboxStore = yield call([ddb, ddb.createStore], userInboxStore);
  yield call([profileStore, profileStore.set], {
    activitiesStore: activitiesStore.address.toString(),
    inboxStore: inboxStore.address.toString(),
    // @TODO: Remove profile store from the schema
    profileStore: profileStore.address.toString(),
  });

  return profileStore;
}

/**
 * Open inbox store from the inbox store address located on user profile data
 * @param  {[string]}    inboxStoreAddress User inbox store address
 */
export function* getInboxStore(inboxStoreAddress: string): Saga<FeedStore> {
  const ddb: DDB = yield getContext('ddb');
  return yield call([ddb, ddb.getStore], userInboxStore, inboxStoreAddress);
}

/**
 * Open user activities store from the address located on user profile data
 * @param  {[string]}    activitiesStoreAddress User activities store address
 */
export function* getUserActivitiesStore(
  activitiesStoreAddress: string,
  walletAddress: string,
): Saga<FeedStore> {
  const ddb: DDB = yield getContext('ddb');
  return yield call(
    [ddb, ddb.getStore],
    userActivitiesStore,
    activitiesStoreAddress,
    {
      walletAddress,
    },
  );
}

export function* getUserProfileData(store: KVStore): Saga<UserProfileProps> {
  return yield call(getAll, store);
}

export function* fetchUserActivities(action: Action): Saga<void> {
  const { walletAddress } = action.payload;
  const activitiesStoreAddress = yield select(
    userActivitiesStoreAddressSelector,
  );

  try {
    const activitiesStore = yield call(
      getUserActivitiesStore,
      activitiesStoreAddress,
      walletAddress,
    );
    const activities = yield call([activitiesStore, activitiesStore.all]);
    yield put({
      type: USER_ACTIVITIES_FETCH_SUCCESS,
      payload: { activities, walletAddress },
    });
  } catch (error) {
    yield putError(USER_ACTIVITIES_FETCH_ERROR, error);
  }
}

export function* addUserActivity(action: Action): Saga<void> {
  const { activity, walletAddress } = action.payload;
  const activitiesStoreAddress = yield select(
    userActivitiesStoreAddressSelector,
  );

  try {
    const activitiesStore = yield call(
      getUserActivitiesStore,
      activitiesStoreAddress,
      walletAddress,
    );

    yield call([activitiesStore, activitiesStore.add], activity);
    const activities = yield call([activitiesStore, activitiesStore.all]);

    yield put({
      type: USER_ACTIVITIES_UPDATE_SUCCESS,
      payload: { activities, walletAddress },
    });
  } catch (error) {
    yield putError(USER_ACTIVITIES_UPDATE_ERROR, error);
  }
}

function* updateProfile(action: Action): Saga<void> {
  try {
    const walletAddress = yield select(walletAddressSelector);

    const ddb: DDB = yield getContext('ddb');

    const store = yield call(
      [ddb, ddb.getStore],
      userProfileStore,
      `user.${walletAddress}`,
      {
        walletAddress,
      },
    );

    // if user is not allowed to write to store, this should throw an error
    // TODO: We want to disallow the easy update of certain fields here. There might be a better way to do this
    const {
      profileStore,
      walletAddress: removedWalletAddress,
      username,
      ...update
    } = action.payload;
    yield call([store, store.set], update);
    const user = yield call(getAll, store);
    yield put({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: user,
    });
  } catch (error) {
    yield putError(USER_PROFILE_UPDATE_ERROR, error);
  }
}

function* fetchProfile(action: Action): Saga<void> {
  const { username } = action.payload;

  const walletAddress = yield select(walletAddressSelector);

  const ddb: DDB = yield getContext('ddb');

  // should throw an error if username is not registered
  try {
    const store = yield call(
      [ddb, ddb.getStore],
      userProfileStore,
      `user.${username}`,
      {
        walletAddress,
      },
    );
    if (!store) throw new Error(`Unable to load store for user "${username}"`);
    const user = yield call(getAll, store);
    yield put({
      type: USER_PROFILE_FETCH_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    yield putError(USER_PROFILE_FETCH_ERROR, error);
  }
}

function* validateUsername(action: Action): Saga<void> {
  const { username } = action.payload;
  yield call(delay, 300);

  const nameHash = yield call(getHashedENSDomainString, username, 'user');

  const getAddressForENSHash = yield call(
    getNetworkMethod,
    'getAddressForENSHash',
  );
  const { ensAddress } = yield call(
    [getAddressForENSHash, getAddressForENSHash.call],
    { nameHash },
  );

  if (ensAddress) {
    yield putError(
      USERNAME_VALIDATE_ERROR,
      new Error('ENS address already exists'),
    );
    return;
  }
  yield put({ type: USERNAME_VALIDATE_SUCCESS });
}

function* createUsername(action: Action): Saga<void> {
  const { username } = action.payload;

  const ddb: DDB = yield getContext('ddb');
  const userProfileStoreAddress = yield select(userProfileStoreAddressSelector);
  const walletAddress = yield select(walletAddressSelector);

  const store = yield call(
    [ddb, ddb.getStore],
    userProfileStore,
    userProfileStoreAddress,
    {
      walletAddress,
    },
  );

  yield call([store, store.set], { username, walletAddress });

  yield put(
    registerUserLabel(
      { username, orbitDBPath: userProfileStoreAddress },
      // TODO: this stems from the new (longer) orbitDB store addresses. I think we should try to shorten those to save on gas
      {
        gasLimit: 500000,
      },
    ),
  );
}

function* fetchAvatar(action: Action): Saga<void> {
  const { hash } = action.payload;
  const ipfsNode = yield getContext('ipfsNode');

  try {
    const avatarData = yield call([ipfsNode, ipfsNode.getString], hash);
    yield put({
      type: USER_AVATAR_FETCH_SUCCESS,
      payload: { hash, avatarData },
    });
  } catch (error) {
    yield putError(USER_AVATAR_FETCH_ERROR, error);
  }
}

function* uploadAvatar(action: Action): Saga<void> {
  const { data } = action.payload;

  const ipfsNode = yield getContext('ipfsNode');
  const ddb: DDB = yield getContext('ddb');

  const userProfileStoreAddress = yield select(userProfileStoreAddressSelector);
  const walletAddress = yield select(walletAddressSelector);

  try {
    // first attempt upload to IPFS
    const hash = yield call([ipfsNode, ipfsNode.addString], data);

    // if we uploaded okay, put the hash in the user orbit store
    const store = yield call(
      [ddb, ddb.getStore],
      userProfileStore,
      userProfileStoreAddress,
      {
        walletAddress,
      },
    );
    yield call([store, store.set], 'avatar', hash);

    yield put({
      type: USER_UPLOAD_AVATAR_SUCCESS,
      payload: { hash },
    });
  } catch (error) {
    yield putError(USER_UPLOAD_AVATAR_ERROR, error);
  }
}

function* removeAvatar(): Saga<void> {
  const ddb: DDB = yield getContext('ddb');

  const userProfileStoreAddress = yield select(userProfileStoreAddressSelector);
  const walletAddress = yield select(walletAddressSelector);

  try {
    const store = yield call(
      [ddb, ddb.getStore],
      userProfileStore,
      userProfileStoreAddress,
      {
        walletAddress,
      },
    );

    yield call([store, store.set], 'avatar', undefined);
    const user = yield call(getAll, store);
    yield put({
      type: USER_REMOVE_AVATAR_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    yield putError(USER_REMOVE_AVATAR_ERROR, error);
  }
}

export function* setupUserSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, updateProfile);
  yield takeLatest(USER_ACTIVITIES_UPDATE, addUserActivity);
  yield takeLatest(USERNAME_VALIDATE, validateUsername);
  yield takeLatest(USERNAME_CREATE, createUsername);
  yield takeLatest(USER_UPLOAD_AVATAR, uploadAvatar);
  yield takeLatest(USER_REMOVE_AVATAR, removeAvatar);
  yield takeEvery(USER_ACTIVITIES_FETCH, fetchUserActivities);
  yield takeEvery(USER_PROFILE_FETCH, fetchProfile);
  yield takeEvery(USER_AVATAR_FETCH, fetchAvatar);
}
