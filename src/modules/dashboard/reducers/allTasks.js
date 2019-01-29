/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { TASK_SET_SKILL_SUCCESS, TASK_SET_DATE_SUCCESS } from '../actionTypes';

import type { Action } from '~types';
import type { AllTasksMap } from '~immutable';

const tasksReducer = (state: AllTasksMap = ImmutableMap(), action: Action) => {
  switch (action.type) {
    // TODO: call these optimistically in the future: meaning not only on success but when starting the action
    case TASK_SET_SKILL_SUCCESS: {
      const { ensName, taskId, skillId } = action.payload;

      // Set property on existing task entry
      return state.setIn([ensName, taskId, 'skillId'], skillId);
    }
    case TASK_SET_DATE_SUCCESS: {
      const { ensName, taskId, dueDate } = action.payload;

      // Set property on existing task entry
      return state.setIn([ensName, taskId, 'dueDate'], dueDate);
    }
    default:
      return state;
  }
};

export default tasksReducer;
