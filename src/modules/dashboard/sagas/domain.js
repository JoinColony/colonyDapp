/* @flow */

import type { Saga } from 'redux-saga';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';

import { DDB } from '../../../lib/database';
import { KVStore } from '../../../lib/database/stores';

import { putError } from '~utils/saga/effects';
import { colonyStore, domainStore } from '../stores';
import {
  DOMAIN_FETCH,
  DOMAIN_FETCH_ERROR,
  DOMAIN_FETCH_SUCCESS,
} from '../actionTypes';

import { getAll } from '../../../lib/database/commands';
import { fetchOrCreateTaskStore } from './task';

/*
 * Fetches from colony identifier, domain identifier, or creates new domain
 */

export function* fetchOrCreateDomainStore({
  colonyAddress,
  domainAddress,
  domainName,
}: {
  colonyAddress?: string,
  domainAddress?: string,
  domainName?: string,
}): Saga<KVStore> {
  const ddb: DDB = yield getContext('ddb');
  let store;

  if (domainAddress) {
    store = yield call([ddb, ddb.getStore], domainStore, domainAddress);
    yield call([store, store.load]);
  } else if (colonyAddress && domainName) {
    const colony = yield call([ddb, ddb.getStore], colonyStore, colonyAddress);
    const domains = yield call([colony, colony.get], 'domains');
    store = yield call([ddb, ddb.getStore], domainStore, domains[domainName]);
    yield call([store, store.load]);
  } else {
    store = yield call([ddb, ddb.createStore], domainStore);
    const draft = domainName === 'rootDomain';
    const taskStore = yield call(fetchOrCreateTaskStore, { draft });
    yield call([store, store.set], {
      tasksDatabase: taskStore.address.toString(),
    });
  }
  return store;
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
  yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);
}
