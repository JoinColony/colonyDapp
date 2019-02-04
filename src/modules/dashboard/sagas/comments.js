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
  payload: { draftId, commentData } = {},
  meta: { id } = {},
}: Action = {}): Saga<void> {
  try {
    /*
     * @TODO Wire message signing to the Gas Station, once it's available
     */
    const wallet = yield getContext('wallet');
    const commentSignature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });
    const commentsStore = yield call(createCommentsStore, draftId);

    /*
     * @NOTE Put the comment in the DDB Feed Store
     */
    yield call([commentsStore, commentsStore.add], {
      signature: commentSignature,
      content: {
        id,
        ...commentData,
      },
    });

    /*
     * @NOTE If the above is sucessfull, put the comment in the Redux Store as well
     */
    yield put({
      type: TASK_COMMENT_ADD_SUCCESS,
      payload: {
        draftId,
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
