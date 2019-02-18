/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import { formatEther } from 'ethers/utils';

import type {
  Action,
  Address,
  UniqueAction,
  UniqueActionWithKeyPath,
} from '~types';
import type { UserProfileType, ContractTransactionType } from '~immutable';

import { putError, callCaller, takeFrom } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';

// @TODO This would go into queries
import { getHashedENSDomainString } from '~utils/web3/ens';
import {
  getFilterFromPartial,
  getFilterFormattedAddress,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';

import {
  getUserProfileStoreIdentifier,
  getUserProfileStore,
  getUserProfileStoreByUsername,
  getUserActivityStore,
  createUserProfileStore,
} from '../../../data/stores';
import { ValidatedKVStore } from '../../../lib/database/stores';
import { getAll } from '../../../lib/database/commands';
import {
  TRANSACTION_CREATED,
  TRANSACTION_SUCCEEDED,
} from '../../core/actionTypes';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { NETWORK_CONTEXT } from '../../core/constants';
import {
  getNetworkMethod,
  getProvider,
  defaultNetwork,
} from '../../core/sagas/utils';
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
  USERNAME_CREATE_ERROR,
  USERNAME_CREATE_SUCCESS,
  USERNAME_FETCH,
  USERNAME_FETCH_ERROR,
  USERNAME_FETCH_SUCCESS,
  CURRENT_USER_GET_BALANCE,
  CURRENT_USER_GET_BALANCE_SUCCESS,
  CURRENT_USER_GET_BALANCE_ERROR,
} from '../actionTypes';

export function* getOrCreateUserStore(
  walletAddress: Address,
): Saga<ValidatedKVStore> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  try {
    // @TODO We have two try-catches here because this isn't suppose to go together!
    const userProfileStoreExists = yield call(
      [ddb, ddb.storeExists],
      getUserProfileStoreIdentifier(walletAddress),
    );
    // @TODO: This should be moved to a command that creates the profile and logs the event
    if (userProfileStoreExists) {
      return yield call(getUserProfileStore(ddb), { walletAddress });
    }
    const { profileStore, activityStore } = yield call(
      createUserProfileStore(ddb),
      { walletAddress },
    );
    yield call([activityStore, activityStore.add], joinedColonyEvent());
    return profileStore;
  } catch (e) {
    return yield putError(CURRENT_USER_CREATE_ERROR, e);
  }
}

export function* getUserProfileData(
  store: ValidatedKVStore,
): Saga<UserProfileType> {
  return yield call(getAll, store);
}

export function* fetchUserActivities(action: Action): Saga<void> {
  const { walletAddress } = action.payload;
  const userActivityStoreAddress = yield select(
    userActivitiesStoreAddressSelector,
  );

  try {
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const activitiesStore = yield call(getUserActivityStore(ddb), {
      userActivityStoreAddress,
      walletAddress,
    });
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
  const userActivityStoreAddress = yield select(
    userActivitiesStoreAddressSelector,
  );

  try {
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const activitiesStore = yield call(getUserActivityStore(ddb), {
      userActivityStoreAddress,
      walletAddress,
    });

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
    walletAddress: removedWalletAddress,
    username,
    // TODO: We want to disallow the easy update of certain fields here. There might be a better way to do this
    ...update
  },
  meta,
}: UniqueAction): Saga<void> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const userStore = yield call(getOrCreateUserStore, walletAddress);
    // if user is not allowed to write to store, this should throw an error
    yield call([userStore, userStore.set], update);
    const user = yield call(getAll, userStore);
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

  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  // should throw an error if username is not registered
  try {
    const store = yield call(getUserProfileStoreByUsername(ddb), {
      walletAddress,
      username,
    });
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
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const walletAddress = yield select(walletAddressSelector);
    const { profileStore, activityStore } = yield call(
      createUserProfileStore(ddb),
      { walletAddress },
    );

    yield fork(createTransaction, meta.id, {
      context: NETWORK_CONTEXT,
      methodName: 'registerUserLabel',
      // @TODO: Replace with a method that just gets the store address given the manifest
      params: { username, orbitDBPath: profileStore.address.toString() },
      options: {
        // TODO: this stems from the new (longer) orbitDB store addresses. I think we should try to shorten those to save on gas
        gasLimit: 500000,
      },
    });

    // Wait until we get the TRANSACTION_CREATED action
    const { payload } = yield takeFrom(txChannel, TRANSACTION_CREATED);

    yield put({
      type: USERNAME_CREATE_SUCCESS,
      payload,
      meta,
    });

    // Wait until the transaction was successful, write to store
    yield takeFrom(txChannel, TRANSACTION_SUCCEEDED);

    yield call([profileStore, profileStore.set], { username, walletAddress });
    yield call([activityStore, activityStore.add], joinedColonyEvent());
  } catch (err) {
    // TODO: We could show a toaster message here. Also: revert stuff?!?!?
    yield putError(USERNAME_CREATE_ERROR, err, meta);
  } finally {
    txChannel.close();
  }
}

function* fetchAvatar(action: Action): Saga<void> {
  const { hash } = action.payload;
  const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);

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
  const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  const walletAddress = yield select(walletAddressSelector);

  try {
    // first attempt upload to IPFS
    const hash = yield call([ipfsNode, ipfsNode.addString], data);

    // if we uploaded okay, put the hash in the user orbit store
    const store = yield call(getUserProfileStore(ddb), { walletAddress });
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
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const walletAddress = yield select(walletAddressSelector);

  try {
    const store = yield call(getUserProfileStore(ddb), { walletAddress });
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
 * ContractTransactionType objects.
 */
function* fetchTokenTransfers(): Saga<void> {
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
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

    const transactions: Array<ContractTransactionType> = yield all(
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

function* updateWalletBalance(): Saga<void> {
  const currentUserAddress = yield select(currentUserAddressSelector);

  try {
    const provider = yield call(getProvider, defaultNetwork);
    /*
     * @NOTE Wallet balance is returned as a BigNumber instance, in WEI
     */
    const walletBalance = yield call(
      [provider, provider.getBalance],
      currentUserAddress,
    );
    yield put({
      type: CURRENT_USER_GET_BALANCE_SUCCESS,
      payload: {
        balance: formatEther(walletBalance),
      },
    });
  } catch (error) {
    yield putError(CURRENT_USER_GET_BALANCE_ERROR, error);
  }
}

export function* setupUserSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, updateProfile);
  yield takeLatest(USER_ACTIVITIES_UPDATE, addUserActivity);
  yield takeLatest(USERNAME_CHECK_AVAILABILITY, validateUsername);
  yield takeLatest(USERNAME_CREATE, createUsername);
  yield takeLatest(USER_UPLOAD_AVATAR, uploadAvatar);
  yield takeLatest(USER_REMOVE_AVATAR, removeAvatar);
  yield takeLatest(CURRENT_USER_GET_BALANCE, updateWalletBalance);
  yield takeEvery(USER_ACTIVITIES_FETCH, fetchUserActivities);
  yield takeEvery(USERNAME_FETCH, fetchUsername);
  yield takeEvery(USER_PROFILE_FETCH, fetchProfile);
  yield takeEvery(USER_AVATAR_FETCH, fetchAvatar);
  yield takeEvery(USER_FETCH_TOKEN_TRANSFERS, fetchTokenTransfers);
}
