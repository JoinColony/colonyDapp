/* @flow */
import type { Saga } from 'redux-saga';
import { call, getContext, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';

import { DDB } from '../../../lib/database';
import { FeedStore } from '../../../lib/database/stores';

import { putError } from '~utils/saga/effects';
import { colonyStore, domainStore, draftStore } from '../stores';
import {
  DRAFT_CREATE,
  DRAFT_CREATE_SUCCESS,
  DRAFT_CREATE_ERROR,
  DRAFT_DELETE,
  DRAFT_DELETE_SUCCESS,
  DRAFT_DELETE_ERROR,
  DRAFT_EDIT,
  DRAFT_EDIT_SUCCESS,
  DRAFT_EDIT_ERROR,
  DRAFTS_FETCH,
  DRAFTS_FETCH_SUCCESS,
  DRAFTS_FETCH_ERROR,
} from '../actionTypes';

import { getAll } from '../../../lib/database/commands';

export function* fetchOrCreateDraftStore({
  colonyAddress,
  draftStoreAddress,
}: {
  colonyAddress?: string,
  draftStoreAddress?: string,
}): Saga<FeedStore> {
  const ddb: DDB = yield getContext('ddb');
  let store;

  if (draftStoreAddress) {
    store = yield call([ddb, ddb.getStore], draftStore, draftStoreAddress);
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

export function* createDraftSaga(action: Action): Saga<void> {
  const { domainAddress, task } = action.payload;
  try {
    const store = yield call(fetchOrCreateDraftStore, { domainAddress });
    yield call([store, store.add], task);
    const draft = yield call([store, store.get], {
      limit: 1,
    });
    yield put({ type: DRAFT_CREATE_SUCCESS, payload: { draft } });
  } catch (error) {
    yield putError(DRAFT_CREATE_ERROR, error);
  }
}

export function* fetchDraftsSaga(action: Action): Saga<void> {
  const { draftStoreAddress } = action.payload;
  try {
    const store = yield call(fetchOrCreateDraftStore, {
      draftStoreAddress,
    });
    const drafts = yield call(getAll, store);
    yield put({ type: DRAFTS_FETCH_SUCCESS, payload: { drafts } });
  } catch (error) {
    yield putError(DRAFTS_FETCH_ERROR, error);
  }
}

export function* editDraftSaga(action: Action): Saga<void> {
  const {
    task: { _id: id },
    task,
    draftStoreAddress,
  } = action.payload;
  try {
    const store = yield call(fetchOrCreateDraftStore, {
      draftStoreAddress,
    });
    yield call([store, store.update], id, task);
    const updated = yield call([store, store.get], id);
    yield put({ type: DRAFT_EDIT_SUCCESS, payload: { updated } });
  } catch (error) {
    yield putError(DRAFT_EDIT_ERROR, error);
  }
}

export function* deleteDraftSaga(action: Action): Saga<void> {
  const { taskHash, draftStoreAddress } = action.payload;
  try {
    const store = yield call(fetchOrCreateDraftStore, {
      draftStoreAddress,
    });
    const deletedHash = yield call([store, store.remove], taskHash);
    yield put({ type: DRAFT_DELETE_SUCCESS, payload: { deletedHash } });
  } catch (error) {
    yield putError(DRAFT_DELETE_ERROR, error);
  }
}

export default function* draftSagas(): any {
  yield takeEvery(DRAFT_CREATE, createDraftSaga);
  yield takeEvery(DRAFT_DELETE, deleteDraftSaga);
  yield takeEvery(DRAFT_EDIT, editDraftSaga);
  yield takeEvery(DRAFTS_FETCH, fetchDraftsSaga);
}
