/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  TASK_CREATE_SUCCESS,
  TASK_FETCH,
  TASK_FETCH_SUCCESS,
  TASK_REMOVE_SUCCESS,
  TASK_SET_DATE_SUCCESS,
  TASK_SET_SKILL_SUCCESS,
  TASK_UPDATE_SUCCESS,
} from '../actionTypes';

import { Task, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath } from '~types';
import type { AllTasksMap, TaskRecord } from '~immutable';

const allTasksReducer = (
  state: AllTasksMap = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case TASK_CREATE_SUCCESS:
    case TASK_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, id],
          keyPath,
        },
        payload,
      } = action;
      const data = Data({ record: Task(payload) });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.set(ensName, ImmutableMap({ [id]: data }));
    }

    // Simple updates (where the payload can be set on the record directly)
    case TASK_UPDATE_SUCCESS:
    case TASK_SET_SKILL_SUCCESS:
    case TASK_SET_DATE_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      return state.mergeDeepIn([...keyPath, 'record'], payload);
    }

    case TASK_REMOVE_SUCCESS:
      return state.deleteIn(action.meta.keyPath);

    default:
      return state;
  }
};

export default withDataReducer<AllTasksMap, TaskRecord>(
  TASK_FETCH,
  new ImmutableMap(),
)(allTasksReducer);
