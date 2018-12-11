/* @flow */

import type { Saga } from 'redux-saga';
import { call, getContext, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import { DDB } from '../../../lib/database';
import { FeedStore, KVStore } from '../../../lib/database/stores';

import { domainStore, taskDraftStore } from '../stores';
import { TASKDRAFT_FETCH, DOMAIN_FETCH } from '../actionTypes';

function* fetchOrCreateDomainStore(action: Action): Saga<KVStore> {
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

function* fetchOrCreateTaskDraftStore(action: Action): Saga<FeedStore> {
  const ddb: DDB = yield getContext('ddb');
  const { taskDraftStoreIdentifier } = action.payload;
  let store;

  if (taskDraftStoreIdentifier) {
    store = yield call(
      [ddb, ddb.getStore],
      taskDraftStore,
      taskDraftStoreIdentifier,
    );
    yield call([store, store.load]);
  } else {
    store = yield call([ddb, ddb.createStore], taskDraftStore);
  }
  return store;
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_FETCH, fetchOrCreateDomainStore);
  yield takeEvery(TASKDRAFT_FETCH, fetchOrCreateTaskDraftStore);
}
