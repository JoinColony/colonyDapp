/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery } from 'redux-saga/effects';

import type { ActionsType } from '~redux';

import { putError } from '../../utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { createCommentsStore } from './shared';

function* addNewComment({
  payload: { draftId, commentData } = {},
  meta: { id } = {},
}: $PropertyType<ActionsType, 'TASK_COMMENT_ADD'>): Saga<void> {
  try {
    /*
     * @TODO Wire message signing to the Gas Station, once it's available
     */
    const wallet = yield* getContext(CONTEXT.WALLET);
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
      type: ACTIONS.TASK_COMMENT_ADD_SUCCESS,
      payload: {
        draftId,
        commentData,
        signature: commentSignature,
      },
      meta: { id },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_COMMENT_ADD_ERROR, error);
  }
}

export default function* commentsSagas(): any {
  yield takeEvery(ACTIONS.TASK_COMMENT_ADD, addNewComment);
}
