/* @flow */

import { replace } from 'connected-react-router';

import type { Saga } from 'redux-saga';

import { delay } from 'redux-saga';
import { call, put, select, getContext, takeLatest } from 'redux-saga/effects';
import namehash from 'eth-ens-namehash-ms';

import type { Action, UserRecord } from '~types/index';

import { NOT_FOUND_ROUTE } from '~routes';
import { create, putError } from '~utils/saga/effects';

import { KVStore } from '../../../lib/database/stores';
// eslint-disable-next-line max-len
import EthereumAccessController from '../../../lib/database/EthereumAccessController';
import { getAll } from '../../../lib/database/commands';
import { networkMethodSagaFactory } from '../../core/sagas/networkClient';

import {
  orbitAddress as orbitAddressSelector,
  walletAddress as walletAddressSelector,
} from '../selectors';

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
  USERNAME_VALIDATE,
  USERNAME_VALIDATE_SUCCESS,
  USERNAME_VALIDATE_ERROR,
  USERNAME_CREATE,
  USERNAME_CREATE_SUCCESS,
  USERNAME_CREATE_ERROR,
} from '../actionTypes';

const registerUserLabel = networkMethodSagaFactory<
  { username: string, orbitDBPath: string },
  { user: string, label: string },
>('registerUserLabel', {
  // TODO: We might want to have another action dispatched on event data (which then feeds the reducer, instead of this one)
  sent: USERNAME_CREATE_SUCCESS,
  error: USERNAME_CREATE_ERROR,
});

export function* getUserStore(walletAddress: string): Saga<KVStore> {
  const ddb = yield getContext('ddb');

  const accessController = yield create(
    EthereumAccessController,
    walletAddress,
  );

  const store = yield call([ddb, ddb.getStore], `user.${walletAddress}`, {
    accessController,
  });
  if (store) {
    yield call([store, store.load]);
    return store;
  }
  return yield call([ddb, ddb.createStore], 'keyvalue', 'userProfile', {
    accessController,
  });
}

export function* getUser(store: KVStore): Saga<UserRecord> {
  return yield call(getAll, store);
}

function* updateProfile(action: Action): Saga<void> {
  const walletAddress = yield select(walletAddressSelector);

  const ddb = yield getContext('ddb');

  const accessController = yield create(
    EthereumAccessController,
    walletAddress,
  );

  const store = yield call([ddb, ddb.getStore], `user.${walletAddress}`, {
    accessController,
  });

  try {
    // if user is not allowed to write to store, this should throw an error
    yield call([store, store.set], action.payload);
    const user = yield call(getAll, store);

    yield put({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: { user, walletAddress },
    });
  } catch (error) {
    yield putError(USER_PROFILE_UPDATE_ERROR, error);
  }
}

function* fetchProfile(action: Action): Saga<void> {
  const { username } = action.payload;

  const walletAddress = yield select(walletAddressSelector);

  const ddb = yield getContext('ddb');

  // should throw an error if username is not registered
  try {
    const accessController = yield create(
      EthereumAccessController,
      walletAddress,
    );

    const store = yield call([ddb, ddb.getStore], `user.${username}`, {
      accessController,
    });

    const user = yield call(getAll, store);

    yield put({
      type: USER_PROFILE_FETCH_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    yield put(replace(NOT_FOUND_ROUTE));
    yield putError(USER_PROFILE_FETCH_ERROR, error);
  }
}

function* validateUsername(action: Action): Saga<void> {
  // Debounce 300ms
  yield call(delay, 300);
  const { username } = action.payload;

  // TODO: consider factoring out this functionality (re-use in ENSResolver)
  const nameHash = namehash.hash(`${username}.user.joincolony.eth`);
  const networkClient = yield getContext('networkClient');
  const { ensAddress } = yield call(
    [
      networkClient.getAddressForENSHash,
      networkClient.getAddressForENSHash.call,
    ],
    { nameHash },
  );

  // If we found a value for `ensAddress`, then this name was previously registered.
  if (ensAddress) {
    yield putError(
      USERNAME_VALIDATE_ERROR,
      new Error('ENS address already exists'),
    );
  } else {
    yield put({
      type: USERNAME_VALIDATE_SUCCESS,
    });
  }
}

function* createUsername(action: Action): Saga<void> {
  const { username } = action.payload;

  const ddb = yield getContext('ddb');
  const orbitDBPath = yield select(orbitAddressSelector);
  const walletAddress = yield select(walletAddressSelector);

  const accessController = yield create(
    EthereumAccessController,
    walletAddress,
  );

  const store = yield call([ddb, ddb.getStore], orbitDBPath, {
    accessController,
  });

  yield call([store, store.set], { username, walletAddress });

  yield call(registerUserLabel, {
    type: action.type,
    payload: {
      params: { username, orbitDBPath },
      // TODO: this stems from the new (longer) orbitDB store addresses. I think we should try to shorten those to save on gas
      options: {
        gasLimit: 500000,
      },
    },
  });
}

export function* setupUserSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, updateProfile);
  yield takeLatest(USER_PROFILE_FETCH, fetchProfile);
  yield takeLatest(USERNAME_VALIDATE, validateUsername);
  yield takeLatest(USERNAME_CREATE, createUsername);
}
