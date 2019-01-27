/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery, getContext, select } from 'redux-saga/effects';

import type { Action } from '~types';

import { putError } from '~utils/saga/effects';

import { createCommentsStore } from './shared';
import { commentsBlueprint } from '../stores';

import ns from '../namespace';

import {
  TASK_COMMENT_ADD,
  TASK_COMMENT_ADD_SUCCESS,
  TASK_COMMENT_ADD_ERROR,
  TASK_COMMENTS_GET,
  TASK_COMMENTS_GET_ERROR,
  TASK_COMMENTS_GET_SUCCESS,
} from '../actionTypes';

/*
 * @NOTE Sagas are explamples only
 *
 * So show basic add / get interfactions of task comments, but they all use mock data.
 * Please replace with actual sagas when the time comes.
 */

function* addNewComment({
  payload: {
    taskId = '8354de0f8e',
    commentData = {
      author: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      timestamp: new Date(),
      body: "Hey! I'm a new comment. Hooray!",
    },
  } = {},
  meta: { id = '21' } = {},
}: Action = {}): Saga<void> {
  let commentsStore;
  try {
    const commentsStoreAddress = yield select(state =>
      state[ns].allComments.get('storeAddress'),
    );

    if (commentsStoreAddress) {
      const ddb = yield getContext('ddb');
      commentsStore = yield call(
        [ddb, ddb.getStore],
        commentsBlueprint,
        commentsStoreAddress,
      );
    }

    if (!commentsStoreAddress) {
      commentsStore = yield call(createCommentsStore, taskId);
    }

    yield call([commentsStore, commentsStore.add], {
      /*
       * @NOTE This needs to be the signature (via the user's wallet)
       * of the serialised `commentData` (eg: toJson)
       */
      signature: 'mock-signature',
      content: {
        id,
        ...commentData,
      },
    });

    yield put({
      type: TASK_COMMENT_ADD_SUCCESS,
      payload: {
        taskId,
        commentData,
        /*
         * @NOTE This is just needed now, so we can store in the `allComments` Redux store
         * In the final version of this, this address is stored inside the task record
         */
        storeAddress: commentsStore.address.toString(),
      },
      meta: { id },
    });
  } catch (error) {
    yield putError(TASK_COMMENT_ADD_ERROR, error);
  }
}

function* listAllComments({
  payload: { taskId = '8354de0f8e' } = {},
}: Action = {}): Saga<void> {
  let commentsStore;
  try {
    const commentsStoreAddress = yield select(state =>
      state[ns].allComments.get('storeAddress'),
    );

    if (!commentsStoreAddress) {
      return null;
    }

    const ddb = yield getContext('ddb');
    commentsStore = yield call(
      [ddb, ddb.getStore],
      commentsBlueprint,
      commentsStoreAddress,
    );

    /* eslint-disable-next-line no-console */
    console.log(
      'Comments DDB Store Values',
      yield call([commentsStore, commentsStore.all]),
    );

    /* eslint-disable-next-line no-console */
    console.log(
      'Comments Redux Store Values',
      yield select(state => state[ns].allComments.get(taskId)),
    );

    return yield put({
      type: TASK_COMMENTS_GET_SUCCESS,
    });
  } catch (error) {
    return yield putError(TASK_COMMENTS_GET_ERROR, error);
  }
}

export default function* commentsSagas(): any {
  yield takeEvery(TASK_COMMENT_ADD, addNewComment);
  yield takeEvery(TASK_COMMENTS_GET, listAllComments);
}
