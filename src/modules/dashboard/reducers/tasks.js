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
    TASK_SET_DESCRIPTION_SUCCESS: *,
    TASK_SET_DOMAIN_SUCCESS: *,
    TASK_SET_DUE_DATE_SUCCESS: *,
    TASK_SET_PAYOUT_SUCCESS: *,
    TASK_SET_SKILL_SUCCESS: *,
    TASK_SET_TITLE_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS: {
      const { colonyName, colonyTasks } = action.payload;
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
                colonyName,
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
        task: { colonyName, draftId },
        taskStoreAddress,
      } = action.payload;
      const task = taskReducer(
        state.getIn([draftId, 'record', 'task'], DataRecord()),
        action,
      );
      const record = TaskReferenceRecord({
        colonyName,
        commentsStoreAddress,
        draftId,
        task,
        taskStoreAddress,
      });
      return state.mergeDeepIn([draftId], DataRecord({ record }));
    }
    case ACTIONS.TASK_SET_DESCRIPTION_SUCCESS:
    case ACTIONS.TASK_SET_DOMAIN_SUCCESS:
    case ACTIONS.TASK_SET_DUE_DATE_SUCCESS:
    case ACTIONS.TASK_SET_PAYOUT_SUCCESS:
    case ACTIONS.TASK_SET_SKILL_SUCCESS:
    case ACTIONS.TASK_SET_TITLE_SUCCESS: {
      const { draftId } = action.payload;
      return state.mergeDeepIn(
        [draftId, 'record', 'task'],
        taskReducer(
          state.getIn([draftId, 'record', 'task'], DataRecord()),
          action,
        ),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<TaskRefsMap, TaskReferenceRecordType>(
  ACTIONS.TASK_FETCH,
  ImmutableMap(),
)(tasksReducer);
