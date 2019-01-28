/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import type { UniqueActionWithKeyPath } from '~types';

import { TaskComment } from '~immutable';

import { TASK_COMMENT_ADD_SUCCESS } from '../actionTypes';

const allCommentsReducer = (
  state: Object = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case TASK_COMMENT_ADD_SUCCESS: {
      const {
        payload: { taskId, commentData, signature },
        meta: { id },
      } = action;
      const comment = TaskComment({
        content: { ...commentData, id },
        signature,
      });
      return state.has(taskId)
        ? state.updateIn([taskId], list => list.push(comment))
        : state.set(taskId, List.of(comment));
    }
    default:
      return state;
  }
};

export default allCommentsReducer;
