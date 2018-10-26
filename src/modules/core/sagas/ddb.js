/* @flow */

import type { Saga } from 'redux-saga';

import { call, getContext } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';

// eslint-disable-next-line max-len
import PurserIdentityProvider from '../../../lib/database/PurserIdentityProvider';

// eslint-disable-next-line import/prefer-default-export
export function* getDDB(): Saga<void> {
  const wallet = yield getContext('wallet');
  const DDB = yield getContext('DDB');
  const ipfsNode = yield getContext('ipfsNode');

  if (!wallet || !DDB || !ipfsNode) {
    throw new Error('Required context for ddb instantiation not found');
  }

  const identityProvider = yield create(PurserIdentityProvider, wallet);
  // const identityProvider = new PurserIdentityProvider(wallet);
  const ddb = yield call(DDB.createDatabase, ipfsNode, identityProvider);

  return ddb;
}
