/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery, getContext } from 'redux-saga/effects';

import type { Action } from '~types';

import { putError } from '~utils/saga/effects';

import { createCommentsStore } from './shared';

import {
  TASK_COMMENT_ADD,
  TASK_COMMENT_ADD_SUCCESS,
  TASK_COMMENT_ADD_ERROR,
} from '../actionTypes';

function* addNewComment({
  payload: { taskId, commentData } = {},
  meta: { id } = {},
}: Action = {}): Saga<void> {
  try {
    const commentsStore = yield call(createCommentsStore, taskId);

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

    /*
     * TODO: Wire message signing to the Gas Station, once it's available
     */
    const wallet = yield getContext('wallet');
    const commentSignature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });

    yield put({
      type: TASK_COMMENT_ADD_SUCCESS,
      payload: {
        taskId,
        commentData,
        signature: commentSignature,
      },
      meta: { id },
    });
  } catch (error) {
    yield putError(TASK_COMMENT_ADD_ERROR, error);
  }
}

export default function* commentsSagas(): any {
  yield takeEvery(TASK_COMMENT_ADD, addNewComment);
}
