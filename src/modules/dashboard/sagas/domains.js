/* @flow */

import type { Saga } from 'redux-saga';
import { call, getContext, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import { DDB } from '../../../lib/database';
import { FeedStore, KVStore } from '../../../lib/database/stores';

import { colonyStore, domainStore, taskDraftStore } from '../stores';
import { DRAFT_FETCH, DOMAIN_FETCH } from '../actionTypes';

/*
 * Fetches from colony identifier, domain identifier, or creates new domain
 */

export function* fetchOrCreateDomainStore({
  domainAddress,
  colonyAddress,
}: {
  domainAddress?: string,
  colonyAddress?: string,
}): Saga<KVStore> {
  const ddb: DDB = yield getContext('ddb');
  let store;

  if (domainAddress) {
    store = yield call([ddb, ddb.getStore], domainStore, domainAddress);
    yield call([store, store.load]);
  } else if (colonyAddress) {
    const colony = yield call([ddb, ddb.getStore], colonyStore, colonyAddress);
    const domain = yield call([colony, colony.get], 'rootDomain');
    store = yield call([ddb, ddb.getStore], domainStore, domain);
    yield call([store, store.load]);
  } else {
    store = yield call([ddb, ddb.createStore], domainStore);
  }
  return store;
}

export function* fetchOrCreateDraftStore(action: Action): Saga<FeedStore> {
  const ddb: DDB = yield getContext('ddb');
  const { domainIdentifier, taskDraftStoreIdentifier } = action.payload;
  let store;

  if (taskDraftStoreIdentifier) {
    store = yield call(
      [ddb, ddb.getStore],
      taskDraftStore,
      taskDraftStoreIdentifier,
    );
    yield call([store, store.load]);
  } else if (domainIdentifier) {
    const domain = yield call(fetchOrCreateDomainStore, domainIdentifier);
    const draftStoreAddress = yield call([domain, domain.get], 'tasksDatabase');
    store = yield call([ddb, ddb.getStore], taskDraftStore, draftStoreAddress);
  } else {
    store = yield call([ddb, ddb.createStore], taskDraftStore);
  }
  return store;
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_FETCH, fetchOrCreateDomainStore);
  yield takeEvery(DRAFT_FETCH, fetchOrCreateDraftStore);
}
