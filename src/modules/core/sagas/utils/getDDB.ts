import { call } from 'redux-saga/effects';

import { create } from '~utils/saga/effects';
import { Context, getContext } from '~context/index';

import { DDB as DDBClass } from '~lib/database';
import PurserIdentityProvider from '~data/PurserIdentityProvider';

export default function* getDDB() {
  const wallet = yield getContext(Context.WALLET);
  const DDB = yield getContext(Context.DDB_CLASS);
  const ipfsNode = yield getContext(Context.IPFS_NODE);

  if (!wallet || !DDB || !ipfsNode) {
    throw new Error('Required context for ddb instantiation not found');
  }

  const identityProvider = yield create(PurserIdentityProvider, wallet);
  const ddb: DDBClass = yield create(DDB, ipfsNode, identityProvider);
  yield call([ddb, ddb.init]);

  return ddb;
}
