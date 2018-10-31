/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, select, getContext, takeLatest } from 'redux-saga/effects';

import { getAll } from '../../../lib/database/commands';

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_ERROR,
  USER_PROFILE_UPDATE_SUCCESS,
} from '../actionTypes';

/* TODO: User is not properly typed yet due to the temporary nature of this */
// eslint-disable-next-line import/prefer-default-export
export function* getUser(): Saga<Object> {
  const ddb = yield getContext('ddb');

  // TODO: get the store first, if it doesn't exist, create it
  // We also need to make sure we create the profile (ENS)
  const store = yield call([ddb, ddb.createStore], 'keyvalue', 'userProfile');

  // TODO: We pre-fill the store here so we have something to see
  // Remove this once we can actually get a store
  yield call([store, store.set], {
    displayName: 'Tim',
    bio: 'from Texas',
  });

  const user = yield call(getAll, store);
  return user;
}

function* updateProfile(action: Object): Saga<void> {
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

function* fetchProfile(action: Object): Saga<void> {
  const { username } = action.payload;
  const ddb = yield getContext('ddb');

  try {
    // should throw an error if username is not registered
    const store = yield call([ddb, ddb.getStore], username);

    const user = yield call(getAll, store);

    yield put({
      type: USER_PROFILE_FETCH_SUCCESS,
      payload: { set: user, walletAddress: user.walletAddress },
    });
  } catch (error) {
    yield put({
      type: USER_PROFILE_FETCH_ERROR,
      payload: { error },
    });
  }
}

function* userSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, updateProfile);
  yield takeLatest(USER_PROFILE_FETCH, fetchProfile);
}

export default userSagas;
