/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { TASK_SET_SKILL_SUCCESS } from '../actionTypes';

import type { Action } from '~types';

import type { TaskRecord } from '~immutable';

type State = ImmutableMap<string, TaskRecord>;

const INITIAL_STATE: State = new ImmutableMap();

const tasksReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    // TODO: call this one optimistically in the future: meaning not only on success
    case TASK_SET_SKILL_SUCCESS: {
      const { ensName, domainId, taskId, skillId } = action.payload;

      // Set property on existing task entry
      return state.setIn(
        [ensName, domainId, 'tasks', taskId, 'skillId'],
        skillId,
      );
    }
    default:
      return state;
  }
};

export default tasksReducer;
