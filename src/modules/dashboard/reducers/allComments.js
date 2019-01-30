/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import type { UniqueActionWithKeyPath } from '~types';

import { TaskCommentRecord } from '~immutable';

import { TASK_COMMENT_ADD_SUCCESS } from '../actionTypes';

const allCommentsReducer = (
  state: Object = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case TASK_COMMENT_ADD_SUCCESS: {
      const {
        payload: { draftId, commentData, signature },
        meta: { id },
      } = action;
      const comment = TaskCommentRecord({
        content: { ...commentData, id },
        signature,
      });
      return state.has(draftId)
        ? state.updateIn([draftId], list => list.push(comment))
        : state.set(draftId, List.of(comment));
    }
    default:
      return state;
  }
};

export default allCommentsReducer;
