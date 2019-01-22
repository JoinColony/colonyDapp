/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  delay,
  put,
  select,
  getContext,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';

import type {
  Action,
  Address,
  UniqueAction,
  UniqueActionWithKeyPath,
} from '~types';
import type { UserProfileProps, ContractTransactionProps } from '~immutable';

import { putError, callCaller } from '~utils/saga/effects';

// @TODO This would go into queries
import { getHashedENSDomainString } from '~utils/web3/ens';
import {
  getFilterFromPartial,
  getFilterFormattedAddress,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';

import { DDB } from '../../../lib/database';
import {
  getUserProfileStoreIdentifier,
  getUserProfileStore,
  getUserActivityStore,
  createUserProfileStore,
} from '../../../data/stores';
import { ValidatedKVStore } from '../../../lib/database/stores';
import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';
import { getAll } from '../../../lib/database/commands';
import { getNetworkMethod } from '../../core/sagas/utils';
import { joinedColonyEvent } from '../../dashboard/components/UserActivities';
import {
  currentUserAddressSelector,
  userActivitiesStoreAddressSelector,
  walletAddressSelector,
} from '../selectors';

import {
  CURRENT_USER_CREATE_ERROR,
  USER_ACTIVITIES_FETCH,
  USER_ACTIVITIES_FETCH_ERROR,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_ACTIVITIES_UPDATE,
  USER_ACTIVITIES_UPDATE_ERROR,
  USER_ACTIVITIES_UPDATE_SUCCESS,
  USER_AVATAR_FETCH,
  USER_AVATAR_FETCH_ERROR,
  USER_AVATAR_FETCH_SUCCESS,
  USER_FETCH_TOKEN_TRANSFERS,
  USER_FETCH_TOKEN_TRANSFERS_ERROR,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_FETCH_SUCCESS,
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_ERROR,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_REMOVE_AVATAR,
  USER_REMOVE_AVATAR_ERROR,
  USER_REMOVE_AVATAR_SUCCESS,
  USER_UPLOAD_AVATAR,
  USER_UPLOAD_AVATAR_ERROR,
  USER_UPLOAD_AVATAR_SUCCESS,
  USERNAME_CHECK_AVAILABILITY,
  USERNAME_CHECK_AVAILABILITY_ERROR,
  USERNAME_CHECK_AVAILABILITY_SUCCESS,
  USERNAME_CREATE,
  USERNAME_FETCH,
  USERNAME_FETCH_ERROR,
  USERNAME_FETCH_SUCCESS,
} from '../actionTypes';
import { registerUserLabel } from '../actionCreators';

export function* getOrCreateUserStore(
  walletAddress: Address,
): Saga<ValidatedKVStore> {
  const ddb: DDB = yield getContext('ddb');

  try {
    // @TODO We have two try-catches here because this isn't suppose to go together!
    const userProfileStoreExists = yield call(
      [ddb, ddb.storeExists],
      getUserProfileStoreIdentifier(walletAddress),
    );
    // @TODO: This should be moved to a command that creates the profile and logs the event
    if (userProfileStoreExists) {
      return yield call(getUserProfileStore(ddb), walletAddress);
    }
    const { profileStore, activityStore } = yield call(
      createUserProfileStore(ddb),
      walletAddress,
    );
    yield call([activityStore, activityStore.add], joinedColonyEvent());
    return profileStore;
  } catch (e) {
    return yield putError(CURRENT_USER_CREATE_ERROR, e);
  }
}

export function* getUserProfileData(
  store: ValidatedKVStore,
): Saga<UserProfileProps> {
  return yield call(getAll, store);
}

export function* fetchUserActivities(action: Action): Saga<void> {
  const { walletAddress } = action.payload;
  const activitiesStoreAddress = yield select(
    userActivitiesStoreAddressSelector,
  );

  try {
    const ddb: DDB = yield getContext('ddb');
    const activitiesStore = yield call(
      getUserActivityStore(ddb),
      activitiesStoreAddress,
      walletAddress,
    );
    const activities = yield call(getAll, activitiesStore);
    yield put({
      type: USER_ACTIVITIES_FETCH_SUCCESS,
      payload: { activities, walletAddress },
    });
  } catch (error) {
    yield putError(USER_ACTIVITIES_FETCH_ERROR, error);
  }
}

export function* addUserActivity({ payload }: Action): Saga<void> {
  const { activity, walletAddress } = payload;
  const activitiesStoreAddress = yield select(
    userActivitiesStoreAddressSelector,
  );

  try {
    const ddb: DDB = yield getContext('ddb');
    const activitiesStore = yield call(
      getUserActivityStore(ddb),
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

function* updateProfile({
  payload: {
    profileStore,
    walletAddress: removedWalletAddress,
    username,
    // TODO: We want to disallow the easy update of certain fields here. There might be a better way to do this
    ...update
  },
  meta,
}: UniqueAction): Saga<void> {
  try {
    // if user is not allowed to write to store, this should throw an error
    yield call([profileStore, profileStore.set], update);
    const user = yield call(getAll, profileStore);
    yield put({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: user,
      meta,
    });
  } catch (error) {
    yield putError(USER_PROFILE_UPDATE_ERROR, error, meta);
  }
}

function* fetchUsername(action: Action): Saga<void> {
  const { userAddress } = action.payload;

  try {
    const { domain } = yield callCaller({
      context: NETWORK_CONTEXT,
      methodName: 'lookupRegisteredENSDomain',
      params: { ensAddress: userAddress },
    });
    if (!domain)
      throw new Error(`No username found for address "${userAddress}"`);
    const [username, type] = domain.split('.');
    if (type !== 'user')
      throw new Error(`Address "${userAddress}" is not a user`);

    yield put({
      type: USERNAME_FETCH_SUCCESS,
      payload: { key: userAddress, username },
    });
  } catch (error) {
    yield putError(USERNAME_FETCH_ERROR, error, { key: userAddress });
  }
}

function* fetchProfile({
  meta: {
    keyPath: [username],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  // TODO: do we want to cache these in redux?
  const nameHash = yield call(getHashedENSDomainString, username, 'user');
  const { ensAddress: walletAddress } = yield callCaller({
    context: NETWORK_CONTEXT,
    methodName: 'getAddressForENSHash',
    params: { nameHash },
  });

  const ddb: DDB = yield getContext('ddb');

  // should throw an error if username is not registered
  try {
    const store = yield call(getUserProfileStore(ddb), walletAddress, username);
    if (!store) throw new Error(`Unable to load store for user "${username}"`);
    const user = yield call(getAll, store);
    yield put({
      type: USER_PROFILE_FETCH_SUCCESS,
      meta,
      payload: user,
    });
  } catch (error) {
    yield putError(USER_PROFILE_FETCH_ERROR, error, meta);
  }
}

function* validateUsername({
  payload: { username },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  yield delay(300);

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
      USERNAME_CHECK_AVAILABILITY_ERROR,
      new Error('ENS address already exists'),
      meta,
    );
    return;
  }
  yield put({ type: USERNAME_CHECK_AVAILABILITY_SUCCESS, meta });
}

function* createUsername({
  payload: { username },
  meta,
}: UniqueAction): Saga<void> {
  const ddb: DDB = yield getContext('ddb');
  const walletAddress = yield select(walletAddressSelector);
  const { profileStore, activityStore } = yield call(
    createUserProfileStore(ddb),
    walletAddress,
  );
  yield call([profileStore, profileStore.set], { username, walletAddress });
  yield call([activityStore, activityStore.add], joinedColonyEvent());

  yield put(
    registerUserLabel({
      // @TODO: Replace with a method that just gets the store address given the manifest
      params: { username, orbitDBPath: profileStore.address.toString() },
      // TODO: this stems from the new (longer) orbitDB store addresses. I think we should try to shorten those to save on gas
      options: {
        gasLimit: 500000,
      },
      meta,
    }),
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

function* uploadAvatar({ payload: { data }, meta }: UniqueAction): Saga<void> {
  const ipfsNode = yield getContext('ipfsNode');
  const ddb: DDB = yield getContext('ddb');

  const walletAddress = yield select(walletAddressSelector);

  try {
    // first attempt upload to IPFS
    const hash = yield call([ipfsNode, ipfsNode.addString], data);

    // if we uploaded okay, put the hash in the user orbit store
    const store = yield call(getUserProfileStore(ddb), walletAddress);
    yield call([store, store.set], 'avatar', hash);

    yield put({
      type: USER_UPLOAD_AVATAR_SUCCESS,
      payload: { hash },
      meta,
    });
  } catch (error) {
    yield putError(USER_UPLOAD_AVATAR_ERROR, error, meta);
  }
}

function* removeAvatar({ meta }: UniqueAction): Saga<void> {
  const ddb: DDB = yield getContext('ddb');
  const walletAddress = yield select(walletAddressSelector);

  try {
    const store = yield call(getUserProfileStore(ddb), walletAddress);
    yield call([store, store.set], 'avatar', undefined);
    const user = yield call(getAll, store);
    yield put({
      type: USER_REMOVE_AVATAR_SUCCESS,
      payload: { user },
      meta,
    });
  } catch (error) {
    yield putError(USER_REMOVE_AVATAR_ERROR, error, meta);
  }
}

// @TODO This would go into a query object
/**
 * Fetch the ERC-20 Token transfers to/from the current user, and parse to
 * ContractTransactionProps objects.
 */
function* fetchTokenTransfers(): Saga<void> {
  const colonyManager = yield getContext('colonyManager');
  const userAddress = yield select(currentUserAddressSelector);

  try {
    // Any ColonyClient will do, so we'll use MetaColony
    const { address: metaColonyAddress } = yield call([
      colonyManager.networkClient.getMetaColonyAddress,
      colonyManager.networkClient.getMetaColonyAddress.call,
    ]);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      metaColonyAddress,
    );

    // Will contain to/from block and event name topics
    const baseLog = yield call(
      getFilterFromPartial,
      { eventNames: ['Transfer'], blocksBack: 400000 },
      colonyClient,
    );

    // Get logs + events for token Transfer to/from current user
    const toTransferLogs = yield call(
      [colonyClient.token, colonyClient.token.getLogs],
      {
        ...baseLog,
        // [eventNames, from, to]
        topics: [[], getFilterFormattedAddress(userAddress)],
      },
    );
    const fromTransferLogs = yield call(
      [colonyClient.token, colonyClient.token.getLogs],
      {
        ...baseLog,
        // [eventNames, from, to]
        topics: [[], undefined, getFilterFormattedAddress(userAddress)],
      },
    );

    // Combine and sort by blockNumber, parse events
    const transferLogs = [...toTransferLogs, ...fromTransferLogs].sort(
      (a, b) => a.blockNumber - b.blockNumber,
    );
    const transferEvents = yield call(
      [colonyClient.token, colonyClient.token.parseLogs],
      transferLogs,
    );

    const transactions: Array<ContractTransactionProps> = yield all(
      transferEvents.map((event, i) =>
        call(parseUserTransferEvent, {
          event,
          log: transferLogs[i],
          colonyClient,
          userAddress,
        }),
      ),
    );

    yield put({
      type: USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
      payload: { transactions },
    });
  } catch (error) {
    yield putError(USER_FETCH_TOKEN_TRANSFERS_ERROR, error);
  }
}

export function* setupUserSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, updateProfile);
  yield takeLatest(USER_ACTIVITIES_UPDATE, addUserActivity);
  yield takeLatest(USERNAME_CHECK_AVAILABILITY, validateUsername);
  yield takeLatest(USERNAME_CREATE, createUsername);
  yield takeLatest(USER_UPLOAD_AVATAR, uploadAvatar);
  yield takeLatest(USER_REMOVE_AVATAR, removeAvatar);
  yield takeEvery(USER_ACTIVITIES_FETCH, fetchUserActivities);
  yield takeEvery(USERNAME_FETCH, fetchUsername);
  yield takeEvery(USER_PROFILE_FETCH, fetchProfile);
  yield takeEvery(USER_AVATAR_FETCH, fetchAvatar);
  yield takeEvery(USER_FETCH_TOKEN_TRANSFERS, fetchTokenTransfers);
}
