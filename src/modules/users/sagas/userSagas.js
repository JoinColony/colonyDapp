/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext } from 'redux-saga/effects';

import { all } from '../../../lib/database/commands';

// eslint-disable-next-line import/prefer-default-export
export function* getUser(): Saga<void> {
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

  const user = yield call(all, store);
  return user;
}
