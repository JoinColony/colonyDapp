/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import { TASK_COMMENT_ADD_SUCCESS } from '../actionTypes';

/*
 * @NOTE Reducers are explamples only
 *
 * Don't follow these, write your own!
 * This are just to test the store/redux functionality prior to the wiring PR
 */

const allCommentsReducer = (state = new ImmutableMap(), action) => {
  switch (action.type) {
    case TASK_COMMENT_ADD_SUCCESS: {
      const {
        payload: { taskId, commentData, storeAddress },
        meta: { id },
      } = action;
      const currentComments = state.get(taskId) || List([]);
      return state
        .setIn(['storeAddress'], storeAddress)
        .set(taskId, List(currentComments.push({ ...commentData, id })));
    }
    default:
      return state;
  }
};

export default allCommentsReducer;
