/* @flow */

import type { Saga } from 'redux-saga';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';

import { DDB } from '../../../lib/database';
import { FeedStore, KVStore } from '../../../lib/database/stores';

import { putError } from '~utils/saga/effects';
import { colonyStore, domainStore, draftStore } from '../stores';
import {
  DRAFT_FETCH,
  DOMAIN_FETCH,
  DOMAIN_FETCH_ERROR,
  DOMAIN_FETCH_SUCCESS,
} from '../actionTypes';

import { getAll } from '../../../lib/database/commands';

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
    const taskStore = yield call(fetchOrCreateDraftStore, {});
    yield call([store, store.set], {
      tasksDatabase: taskStore.address.toString(),
    });
  }
  yield call([store, store.load]);
  return store;
}

function* fetchDomainSaga({ payload: { domainAddress } }: Action): Saga<void> {
  try {
    const store = yield call(fetchOrCreateDomainStore, { domainAddress });
    const domainStoreData = yield call(getAll, store);
    yield put({
      type: DOMAIN_FETCH_SUCCESS,
      payload: { domainStoreData },
    });
  } catch (error) {
    yield putError(DOMAIN_FETCH_ERROR, error);
  }
}

export function* fetchOrCreateDraftStore({
  colonyAddress,
  domainAddress,
  draftStoreAddress,
}: {
  domainAddress?: string,
  colonyAddress?: string,
  draftStoreAddress?: string,
}): Saga<FeedStore> {
  const ddb: DDB = yield getContext('ddb');
  let store;

  if (draftStoreAddress) {
    store = yield call([ddb, ddb.getStore], draftStore, draftStoreAddress);
  } else if (domainAddress) {
    const domain = yield call(fetchOrCreateDomainStore, { domainAddress });
    const draftAddress = yield call([domain, domain.get], 'tasksDatabase');
    store = yield call([ddb, ddb.getStore], draftStore, draftAddress);
  } else if (colonyAddress) {
    // we presume the root domain is desired
    const colony = yield call([ddb, ddb.getStore], colonyStore, colonyAddress);
    yield call([colony, colony.load]);
    const rootDomainAddress = yield call([colony, colony.get], 'rootDomain');
    const rootDomain = yield call(
      [ddb, ddb.getStore],
      domainStore,
      rootDomainAddress,
    );
    yield call([rootDomain, rootDomain.load]);
    const draftsAddress = yield call(
      [rootDomain, rootDomain.get],
      'tasksDatabase',
    );
    store = yield call([ddb, ddb.getStore], draftStore, draftsAddress);
  } else {
    store = yield call([ddb, ddb.createStore], draftStore);
  }
  yield call([store, store.load]);
  return store;
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);
  yield takeEvery(DRAFT_FETCH, fetchOrCreateDraftStore);
}
