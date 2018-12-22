/* @flow */

import type { Saga } from 'redux-saga';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';

import { DDB } from '../../../lib/database';
import { KVStore } from '../../../lib/database/stores';

import { putError } from '~utils/saga/effects';
import { colonyStore, domainStore } from '../stores';
import {
  DOMAIN_CREATE,
  DOMAIN_CREATE_ERROR,
  DOMAIN_CREATE_SUCCESS,
  DOMAIN_FETCH,
  DOMAIN_FETCH_ERROR,
  DOMAIN_FETCH_SUCCESS,
} from '../actionTypes';

import { getAll } from '../../../lib/database/commands';
import { createTaskStore } from './task';
import { createDraftStore } from './draft';

/*
 * Fetches from colony identifier, domain identifier, or creates new domain
 */

export function* fetchOrCreateDomainStore({
  colonyENSName,
  domainAddress,
  domainName,
}: {
  colonyENSName?: string,
  domainAddress?: string,
  domainName?: string,
}): Saga<KVStore> {
  const ddb: DDB = yield getContext('ddb');
  let store;

  if (domainAddress) {
    store = yield call([ddb, ddb.getStore], domainStore, domainAddress);
    yield call([store, store.load]);
  } else if (colonyENSName && domainName) {
    const colony = yield call([ddb, ddb.getStore], colonyStore, colonyENSName);
    const domains = yield call([colony, colony.get], 'domains');
    store = yield call([ddb, ddb.getStore], domainStore, domains[domainName]);
    yield call([store, store.load]);
  } else {
    if (!domainName)
      throw new Error('Please supply a name when creating a domain');
    store = yield call([ddb, ddb.createStore], domainStore);
    const draft = domainName === 'rootDomain';
    const taskStore = draft
      ? yield call(createDraftStore)
      : yield call(createTaskStore);
    yield call([store, store.set], {
      tasksDatabase: taskStore.address.toString(),
      name: domainName,
    });
  }
  return store;
}

function* createDomainSaga({
  payload: { colonyENSName, domainName },
}: Action): Saga<void> {
  try {
    const store = yield call(fetchOrCreateDomainStore, { domainName });
    const domainStoreData = yield call(getAll, store);
    yield put({
      type: DOMAIN_CREATE_SUCCESS,
      payload: { colonyENSName, domainStoreData, id: store.address.toString() },
    });
  } catch (error) {
    yield putError(DOMAIN_CREATE_ERROR, error);
  }
}

function* fetchDomainSaga({
  payload: { domainAddress, colonyENSName },
}: Action): Saga<void> {
  try {
    const store = yield call(fetchOrCreateDomainStore, { domainAddress });
    const domainStoreData = yield call(getAll, store);
    yield put({
      type: DOMAIN_FETCH_SUCCESS,
      payload: { colonyENSName, domainStoreData, id: store.address.toString() },
    });
  } catch (error) {
    yield putError(DOMAIN_FETCH_ERROR, error);
  }
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_CREATE, createDomainSaga);
  yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);
}
