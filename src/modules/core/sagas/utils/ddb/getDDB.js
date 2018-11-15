/* @flow */

import { call, getContext } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';

import { DDB as DDBClass } from '../../../../../lib/database/index';
// eslint-disable-next-line max-len
import PurserIdentityProvider from '../../../../../lib/database/PurserIdentityProvider';

export default function* getDDB(): Generator<*, DDBClass, *> {
  const wallet = yield getContext('wallet');
  const DDB = yield getContext('DDB');
  const ipfsNode = yield getContext('ipfsNode');

  if (!wallet || !DDB || !ipfsNode) {
    throw new Error('Required context for ddb instantiation not found');
  }

  const identityProvider = yield create(PurserIdentityProvider, wallet);
  const ddb = yield call(DDB.createDatabase, ipfsNode, identityProvider);

  return ddb;
}
