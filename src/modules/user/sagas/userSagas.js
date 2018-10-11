/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  put,
  takeLatest,
  getContext,
  setContext,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';

// eslint-disable-next-line max-len
import PurserIdentityProvider from '../../../lib/database/PurserIdentityProvider';

import { all } from '../../../lib/database/commands';

import { WALLET_SET, SET_CURRENT_USER } from '../actionTypes';

function* initializeUser(action: Object): Saga<void> {
  const { currentAddress } = action.payload;

  const DDB = yield getContext('DDB');
  const wallet = yield getContext('currentWallet');
  const ipfsNode = yield getContext('ipfsNode');

  const identityProvider = new PurserIdentityProvider(wallet.instance);

  const ddb = yield call(DDB.createDatabase, ipfsNode, identityProvider);

  yield setContext({ ddb });

  // TODO: First try to get the store, then create it
  const store = yield call([ddb, ddb.createStore], 'keyvalue', 'userProfile');

  // TODO: We pre-fill the store here so we have something to see
  yield call([store, store.put], {
    name: 'Tim',
    bio: 'from Texas',
  });

  const user = all(store);

  yield put({
    type: SET_CURRENT_USER,
    payload: { set: user, walletAddress: currentAddress },
  });

  // TODO: This should NOT be necessary, I think the routes should automatically redirect when the wallet is set.
  yield put(replace('/dashboard'));
}

function* userSagas(): any {
  yield takeLatest(WALLET_SET, initializeUser);
}

export default userSagas;
