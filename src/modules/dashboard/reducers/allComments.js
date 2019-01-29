/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import type { UniqueActionWithKeyPath } from '~types';
import type { AllCommentsMap } from '~immutable';

import { TaskComment } from '~immutable';

import { TASK_COMMENT_ADD_SUCCESS } from '../actionTypes';

/*
 * @NOTE Reducers are examples only
 *
 * Don't follow these, write your own!
 * This are just to test the store/redux functionality prior to the wiring PR
 */

const allCommentsReducer = (
  /*
   * @TODO Add proper store for the `allComments` Map
   */
  state: AllCommentsMap = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case TASK_COMMENT_ADD_SUCCESS: {
      const {
        payload: { taskId, commentData, storeAddress },
        meta: { id },
      } = action;
      const comment = TaskComment({ ...commentData, id });
      return (state.has(taskId)
        ? state.updateIn([taskId], list => list.push(comment))
        : state.set(taskId, List.of(comment))
      ).merge({ storeAddress });
    }
    default:
      return state;
  }
};

export default allCommentsReducer;
