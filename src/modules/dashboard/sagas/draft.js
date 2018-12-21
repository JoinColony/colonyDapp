/* @flow */
import type { Saga } from 'redux-saga';
import { all, call, getContext, put, takeEvery } from 'redux-saga/effects';
import generateId from '~utils/id';

import type { Action } from '~types';

import { putError } from '~utils/saga/effects';
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
  DRAFT_FETCH_SUCCESS,
  DRAFTS_FETCH,
  DRAFTS_FETCH_ERROR,
} from '../actionTypes';

import { DDB } from '../../../lib/database';
import { getAll } from '../../../lib/database/commands';
import { DocStore } from '../../../lib/database/stores';
import { colonyStore, domainStore, draftStore } from '../stores';

export function* fetchDraftStore({
  colonyAddress = '',
  draftStoreAddress,
}: {
  colonyAddress?: string,
  draftStoreAddress?: string,
}): Saga<DocStore> {
  let store;
  const ddb: DDB = yield getContext('ddb');
  if (draftStoreAddress) {
    store = yield call([ddb, ddb.getStore], draftStore, draftStoreAddress);
  } else {
    if (!colonyAddress.length)
      throw new Error('Provide an address to retrieve the draft store');
    // get the colony
    const colony = yield call([ddb, ddb.getStore], colonyStore, colonyAddress);
    yield call([colony, colony.load]);
    // get the correct domain
    const domains = yield call([colony, colony.get], 'domains');
    const domain = yield call(
      [ddb, ddb.getStore],
      domainStore,
      domains.rootDomain,
    );
    yield call([domain, domain.load]);
    // get the tasks database, stored under 'tasksDatabase' even if drafts
    const draftsAddress = yield call([domain, domain.get], 'tasksDatabase');
    store = yield call([ddb, ddb.getStore], draftStore, draftsAddress);
  }
  yield call([store, store.load]);
  return store;
}

export function* createDraftStore(): Saga<DocStore> {
  const ddb: DDB = yield getContext('ddb');
  const store = yield call([ddb, ddb.createStore], draftStore);
  return store;
}

export function* createDraftSaga(action: Action): Saga<void> {
  const { domainAddress, task } = action.payload;
  try {
    const store = yield call(fetchDraftStore, {
      domainAddress,
      draft: true,
    });
    const id = task.id ? task.id : generateId();
    yield call([store, store.add], { ...task, id });
    const draft = yield call([store, store.get], id);
    yield put({ type: DRAFT_CREATE_SUCCESS, payload: { draft } });
  } catch (error) {
    yield putError(DRAFT_CREATE_ERROR, error);
  }
}

export function* fetchAllDraftsSaga(action: Action): Saga<void> {
  const { draftStoreAddress } = action.payload;
  try {
    const store = yield call(fetchDraftStore, {
      draftStoreAddress,
    });
    const drafts = yield call(getAll, store);
    yield all(
      drafts.map(draft =>
        put({ type: DRAFT_FETCH_SUCCESS, payload: { draft } }),
      ),
    );
  } catch (error) {
    yield putError(DRAFTS_FETCH_ERROR, error);
  }
}

export function* fetchDraft({
  draftStoreAddress,
  taskId,
}: {
  draftStoreAddress?: string,
  taskId: string,
}): Generator<*, *, DocStore> {
  const store = yield call(fetchDraftStore, {
    draftStoreAddress,
    draft: true,
  });
  const task = yield call([store, store.get], taskId);
  return task;
}

export function* editDraftSaga(action: Action): Saga<void> {
  const {
    task: { _id: id },
    task,
    draftStoreAddress,
  } = action.payload;
  try {
    const store = yield call(fetchDraftStore, {
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
  const {
    taskId,
    taskStoreAddress,
    colonyENSName,
    domainAddress,
  } = action.payload;
  try {
    const store = yield call(fetchDraftStore, {
      taskStoreAddress,
      draft: true,
    });
    yield call([store, store.remove], taskId);
    yield put({
      type: DRAFT_DELETE_SUCCESS,
      payload: { taskId, ensName: colonyENSName, domainId: domainAddress },
    });
  } catch (error) {
    yield putError(DRAFT_DELETE_ERROR, error);
  }
}

export default function* draftSagas(): any {
  yield takeEvery(DRAFT_CREATE, createDraftSaga);
  yield takeEvery(DRAFT_DELETE, deleteDraftSaga);
  yield takeEvery(DRAFT_EDIT, editDraftSaga);
  yield takeEvery(DRAFTS_FETCH, fetchAllDraftsSaga);
}
