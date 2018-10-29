/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  put,
  select,
  takeLatest,
  getContext,
  setContext,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import { DASHBOARD_ROUTE } from '~routes';

// eslint-disable-next-line max-len
import PurserIdentityProvider from '../../../lib/database/PurserIdentityProvider';

import { resolvers } from '../../../lib/database';
import { getAll } from '../../../lib/database/commands';

import {
  SET_CURRENT_USER,
  SET_CURRENT_USER_ERROR,
  USER_PROFILE_UPDATE,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_ERROR,
  WALLET_SET,
} from '../actionTypes';

function* initializeUser(): Saga<void> {
  let store;

  try {
    const DDB = yield getContext('DDB');
    const wallet = yield getContext('currentWallet');
    const ipfsNode = yield getContext('ipfsNode');
    const colonyNetwork = yield getContext('colonyNetwork');

    const identityProvider = new PurserIdentityProvider(wallet.instance);

    const ddb = yield call(DDB.createDatabase, ipfsNode, identityProvider);

    ddb.addResolver('user', new resolvers.UserResolver(colonyNetwork));

    yield setContext({ ddb });
    // TODO: First try to get the store, then create it
    store = yield call([ddb, ddb.createStore], 'keyvalue', 'userProfile');
  } catch (error) {
    yield put({
      type: SET_CURRENT_USER_ERROR,
      payload: { error },
    });
    return;
  }

  // TODO: We pre-fill the store here so we have something to see
  // Remove this once we can actually get a store
  yield call([store, store.set], {
    username: 'Tim',
    bio: 'from Texas',
  });

  const user = yield call(getAll, store);

  yield put({
    type: SET_CURRENT_USER,
    payload: { user },
  });

  // TODO: This should NOT be necessary, I think the routes should automatically redirect when the wallet is set.
  yield put(replace(DASHBOARD_ROUTE));
}

function* editProfile(action: Object): Saga<void> {
  const currentAddress = select(state => state.wallet.currentAddress);

  const ddb = yield getContext('ddb');

  const store = yield call([ddb, ddb.getStore], currentAddress);

  try {
    // if user is not allowed to write to store, this should throw an error
    yield store.set(action.payload);
    const user = yield call(getAll, store);

    yield put({
      type: USER_PROFILE_UPDATE_SUCCESS,
      payload: { user },
    });
  } catch (error) {
    yield put({
      type: USER_PROFILE_UPDATE_ERROR,
      payload: { error },
    });
  }
}

function* userSagas(): any {
  yield takeLatest(USER_PROFILE_UPDATE, editProfile);
  yield takeLatest(WALLET_SET, initializeUser);
}

export default userSagas;
