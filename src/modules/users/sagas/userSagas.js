/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext } from 'redux-saga/effects';

import { all } from '../../../lib/database/commands';

import { EDIT_USER_PROFILE, WALLET_SET } from '../actionTypes';

import {
  setCurrentUser,
  setCurrentUserError,
  updateUserProfile,
  updateUserProfileError,
} from '../actionCreators';

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
    yield put(setCurrentUserError(error));
    return;
  }

  // TODO: We pre-fill the store here so we have something to see
  // Remove this once we can actually get a store
  yield call([store, store.set], {
    displayName: 'Tim',
    bio: 'from Texas',
  });

  const user = yield call(all, store);

  yield put(setCurrentUser(user, currentAddress));

  // TODO: This should NOT be necessary, I think the routes should automatically redirect when the wallet is set.
  yield put(replace(DASHBOARD_ROUTE));
}

function* editProfile(action) {
  const { currentAddress, update } = action.payload;
  const ddb = yield getContext('ddb');
  const store = ddb.getStore(currentAddress);
  yield store.set(update);
  const currentState = yield call(all, store);

  yield put(updateUserProfile(currentState, currentAddress));
}

function* userSagas(): any {
  yield takeLatest(EDIT_USER_PROFILE, editProfile);
  yield takeLatest(WALLET_SET, initializeUser);
}

export default userSagas;
