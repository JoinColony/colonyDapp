/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  put,
  takeLatest,
  getContext,
  setContext,
} from 'redux-saga/effects';

// eslint-disable-next-line max-len
import PurserIdentityProvider from '../../../lib/database/PurserIdentityProvider';

import { Resolvers } from '../../../lib/database';
import { all } from '../../../lib/database/commands';

import {
  WALLET_SET,
  SET_CURRENT_USER,
  SET_CURRENT_USER_ERROR,
} from '../actionTypes';

function* initializeUser(action: Object): Saga<void> {
  const { currentAddress } = action.payload;

  let store;

  try {
    const DDB = yield getContext('DDB');
    const wallet = yield getContext('currentWallet');
    const ipfsNode = yield getContext('ipfsNode');
    const colonyNetwork = yield getContext('colonyNetwork');

    const identityProvider = new PurserIdentityProvider(wallet.instance);

    const ddb = yield call(DDB.createDatabase, ipfsNode, identityProvider);

    ddb.addResolver('user', new Resolvers.UserResolver(colonyNetwork));

    yield setContext({ ddb });
    // TODO: First try to get the store, then create it
    store = yield call([ddb, ddb.createStore], 'keyvalue', 'userProfile');
  } catch (error) {
    yield put({
      type: SET_CURRENT_USER_ERROR,
      payload: error,
    });
    return;
  }

  // TODO: We pre-fill the store here so we have something to see
  // Remove this once we can actually get a store
  yield call([store, store.set], {
    name: 'Tim',
    bio: 'from Texas',
  });

  const user = yield call(all, store);

  yield put({
    type: SET_CURRENT_USER,
    payload: { set: user, walletAddress: currentAddress },
  });
}

function* userSagas(): any {
  yield takeLatest(WALLET_SET, initializeUser);
}

export default userSagas;
