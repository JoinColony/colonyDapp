/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext } from 'redux-saga/effects';

// eslint-disable-next-line max-len
import PurserIdentityProvider from '../../../lib/database/PurserIdentityProvider';

import { all } from '../../../lib/database/commands';

export function* getDDB(): Saga<void> {
  const wallet = yield getContext('wallet');
  const DDB = yield getContext('DDB');
  const ipfsNode = yield getContext('ipfsNode');

  if (!wallet || !DDB || !ipfsNode) {
    throw new Error('Required context for ddb instantiation not found');
  }

  const identityProvider = new PurserIdentityProvider(wallet);
  const ddb = yield call(DDB.createDatabase, ipfsNode, identityProvider);

  return ddb;
}

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
