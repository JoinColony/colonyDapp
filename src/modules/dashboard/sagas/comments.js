/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~types';
import { putError, executeCommand } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';

import { postComment } from '../../../data/service/commands';

// @NOTE: This is here for testing purposes, once we have the task creation, we won't need it anymore
import { comments as commentStoreBlueprint } from '../../../data/blueprints';
import {
  TASK_COMMENT_ADD,
  TASK_COMMENT_ADD_SUCCESS,
  TASK_COMMENT_ADD_ERROR,
} from '../actionTypes';

function* addNewComment({
  payload: { /* commentStoreAddress */ draftId, commentData } = {},
  meta: { id } = {},
}: Action = {}): Saga<void> {
  try {
    /*
     * @TODO Wire message signing to the Gas Station, once it's available
     */
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const wallet = yield* getContext(CONTEXT.WALLET);
    const commentSignature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });

    // @NOTE: This is here for testing purposes, once we have the task creation, we won't need it anymore
    const commentStore = yield call(
      [ddb, ddb.createStore],
      commentStoreBlueprint,
    );

    /*
     * @NOTE Put the comment in the DDB Feed Store
     */
    const context = {
      ddb,
      metadata: { commentStoreAddress: commentStore.address.toString() },
    };
    yield* executeCommand(context, postComment, {
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
