/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import { TaskRecord, DataRecord } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { AllTasksMap, TaskRecordType } from '~immutable';
import type { ReducerType } from '~redux/types';

const allTasksReducer: ReducerType<
  AllTasksMap,
  {|
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH_SUCCESS: *,
    TASK_FETCH_COMMENTS: *,
    TASK_REMOVE_SUCCESS: *,
    // TASK_SET_DATE_SUCCESS: *,
    // TASK_SET_SKILL_SUCCESS: *,
    TASK_UPDATE_SUCCESS: *,
  |},
> = (state = new ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_CREATE_SUCCESS:
    case ACTIONS.TASK_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, id],
          keyPath,
        },
        payload,
      } = action;
      const data = DataRecord({ record: TaskRecord(payload) });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.set(ensName, ImmutableMap({ [id]: data }));
    }

    // TODO handle these cases
    // case ACTIONS.TASK_SET_SKILL_SUCCESS:
    // case ACTIONS.TASK_SET_DATE_SUCCESS:
    case ACTIONS.TASK_UPDATE_SUCCESS: {
      // Simple update (where the payload can be set on the record directly)
      const {
        meta: { keyPath },
        payload,
      } = action;
      return state.mergeDeepIn([...keyPath, 'record'], payload);
    }

    case ACTIONS.TASK_REMOVE_SUCCESS:
      return state.deleteIn(action.meta.keyPath);

    default:
      return state;
  }
};

export default withDataReducer<AllTasksMap, TaskRecordType>(
  ACTIONS.TASK_FETCH,
  new ImmutableMap(),
)(allTasksReducer);
