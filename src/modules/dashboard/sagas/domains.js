/* @flow */

import type { Saga } from 'redux-saga';
import { call, getContext, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import { DDB } from '../../../lib/database';
import { KVStore } from '../../../lib/database/stores';

import { domainStore } from '../stores';

import { DOMAIN_FETCH } from '../actionTypes';

function* fetchOrCreateDomainDDB(action: Action): Saga<KVStore> {
  const ddb: DDB = yield getContext('ddb');
  const { domainIdentifier } = action.payload;
  let store;

  if (domainIdentifier) {
    store = yield call([ddb, ddb.getStore], domainStore, domainIdentifier);
    yield call([store, store.load]);
  } else {
    store = yield call([ddb, ddb.createStore], domainStore);
  }
  return store;
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_FETCH, fetchOrCreateDomainDDB);
}
