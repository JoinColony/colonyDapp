/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';

import { DDB as DDBClass } from '~lib/database';
import PurserIdentityProvider from '~data/PurserIdentityProvider';

export default function* getDDB(): Saga<DDBClass> {
  const wallet = yield* getContext(CONTEXT.WALLET);
  const DDB = yield* getContext(CONTEXT.DDB_CLASS);
  const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);

  if (!wallet || !DDB || !ipfsNode) {
    throw new Error('Required context for ddb instantiation not found');
  }

  const identityProvider = yield create(PurserIdentityProvider, wallet);
  const ddb: DDB = yield create(DDB, ipfsNode, identityProvider);
  yield call([ddb, ddb.init]);

  return ddb;
}
