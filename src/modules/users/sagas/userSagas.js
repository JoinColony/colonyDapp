/* @flow */

import { replace } from 'connected-react-router';

import type { Saga } from 'redux-saga';

import { call, put, select, getContext, takeLatest } from 'redux-saga/effects';

import type { Action, UserRecord } from '~types/index';

import { NOT_FOUND_ROUTE } from '~routes';

import { KVStore } from '../../../lib/database/stores';
// eslint-disable-next-line max-len
import EthereumAccessController from '../../../lib/database/EthereumAccessController';
import { getAll } from '../../../lib/database/commands';

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
  // USERNAME_CREATE,
  // USERNAME_CREATE_SUCCESS,
  // USERNAME_CREATE_ERROR,
} from '../actionTypes';

export function* getUserStore(walletAddress: string): Saga<KVStore> {
  const ddb = yield getContext('ddb');

  const accessController = new EthereumAccessController(walletAddress);
  const store = yield call([ddb, ddb.getStore], `user.${walletAddress}`, {
    accessController,
  });
  if (store) return store;
  return yield call([ddb, ddb.createStore], 'keyvalue', 'userProfile', {
    accessController,
  });
}

export function* getUser(store: KVStore): Saga<UserRecord> {
  return yield call(getAll, store);
}

function* updateProfile(action: Action): Saga<void> {
  const currentAddress = select(state => state.wallet.currentAddress);

  const ddb = yield getContext('ddb');

  const store = yield call([ddb, ddb.getStore], currentAddress);

  try {
    // if user is not allowed to write to store, this should throw an error
    yield call([store, store.set], action.payload);
    const user = yield call(getAll, store);

    yield put({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: { set: user, walletAddress: currentAddress },
    });
  } catch (error) {
    yield put({
      type: USER_PROFILE_UPDATE_ERROR,
      payload: { error },
    });
  }
}

function* fetchProfile(action: Action): Saga<void> {
  const { username } = action.payload;
  const ddb = yield getContext('ddb');

  try {
    // should throw an error if username is not registered
    const store = yield call([ddb, ddb.getStore], username);

    const user = yield call(getAll, store);

    yield put({
      type: USER_PROFILE_FETCH_SUCCESS,
      payload: { user, walletAddress: user.walletAddress },
    });
  } catch (error) {
    yield put(replace(NOT_FOUND_ROUTE));

    // TODO normalize error object handling
    yield put({
      type: USER_PROFILE_FETCH_ERROR,
      payload: { error: error.message },
    });
  }
}

export function* setupUserSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, updateProfile);
  yield takeLatest(USER_PROFILE_FETCH, fetchProfile);
}
