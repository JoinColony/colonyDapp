/* @flow */
import type { Saga } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

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
  DRAFTS_FETCH,
  DRAFTS_FETCH_SUCCESS,
  DRAFTS_FETCH_ERROR,
} from '../actionTypes';

import { getAll } from '../../../lib/database/commands';
import { DocStore } from '../../../lib/database/stores';
import { fetchOrCreateTaskStore } from './task';

export function* createDraftSaga(action: Action): Saga<void> {
  const { domainAddress, task } = action.payload;
  try {
    const store = yield call(fetchOrCreateTaskStore, { domainAddress });
    yield call([store, store.add], task);
    const draft = yield call([store, store.get], {
      limit: 1,
    });
    yield put({ type: DRAFT_CREATE_SUCCESS, payload: { draft } });
  } catch (error) {
    yield putError(DRAFT_CREATE_ERROR, error);
  }
}

export function* fetchAllDraftsSaga(action: Action): Saga<void> {
  const { draftStoreAddress } = action.payload;
  try {
    const store = yield call(fetchOrCreateTaskStore, {
      draftStoreAddress,
    });
    const drafts = yield call(getAll, store);
    yield put({ type: DRAFTS_FETCH_SUCCESS, payload: { drafts } });
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
  const store = yield call(fetchOrCreateTaskStore, {
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
    const store = yield call(fetchOrCreateTaskStore, {
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
  const { taskId, taskStoreAddress } = action.payload;
  try {
    const store = yield call(fetchOrCreateTaskStore, {
      taskStoreAddress,
      draft: true,
    });
    const deletedHash = yield call([store, store.remove], taskId);
    yield put({ type: DRAFT_DELETE_SUCCESS, payload: { deletedHash } });
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
