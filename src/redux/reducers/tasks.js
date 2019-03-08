/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { ReducerType } from '~redux';
import type { TaskReferenceRecordType, TaskRefsMap } from '~immutable';

import { TaskReferenceRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecordMap } from '~utils/reducers';

import taskReducer from './task';

const tasksReducer: ReducerType<
  TaskRefsMap,
  {|
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH_ALL_FOR_COLONY_SUCCESS: *,
    TASK_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS: {
      const { colonyENSName, colonyTasks } = action.payload;
      const draftIds = Object.keys(colonyTasks);
      return state.withMutations(mutableState => {
        draftIds.forEach(draftId => {
          mutableState.mergeDeepIn(
            [draftId],
            DataRecord({
              error: undefined,
              isFetching: false,
              lastFetchedAt: new Date(),
              record: TaskReferenceRecord({
                colonyENSName,
                draftId,
                ...colonyTasks[draftId],
              }),
            }),
          );
        });
      });
    }
    case ACTIONS.TASK_CREATE_SUCCESS:
    case ACTIONS.TASK_FETCH_SUCCESS: {
      const {
        commentsStoreAddress,
        task: { colonyENSName, draftId },
        taskStoreAddress,
      } = action.payload;
      const task = taskReducer(
        state.getIn([draftId, 'record', 'task'], DataRecord()),
        action,
      );
      const record = TaskReferenceRecord({
        colonyENSName,
        commentsStoreAddress,
        draftId,
        task,
        taskStoreAddress,
      });
      return state.mergeDeepIn([draftId], DataRecord({ record }));
    }
    default:
      return state;
  }
};

export default withDataRecordMap<TaskRefsMap, TaskReferenceRecordType>(
  ACTIONS.TASK_FETCH,
  ImmutableMap(),
)(tasksReducer);
