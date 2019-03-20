/* @flow */

import type { ReducerType } from '~redux';
import type { DataRecordType, TaskRecordType } from '~immutable';

import { ACTIONS } from '~redux';
import { DataRecord, TaskRecord } from '~immutable';

const taskReducer: ReducerType<
  DataRecordType<TaskRecordType>,
  {|
    TASK_CREATE_SUCCESS: *,
    TASK_FETCH_SUCCESS: *,
  |},
> = (state = DataRecord(), action) => {
  switch (action.type) {
    // TODO in #939 handle all task state!
    case ACTIONS.TASK_CREATE_SUCCESS:
    case ACTIONS.TASK_FETCH_SUCCESS: {
      // TODO in #939 handle these things properly
      // $FlowFixMe
      const { feedItems, manager, worker, payouts, ...task } = action.payload;
      return DataRecord({
        isFetching: false,
        error: undefined,
        record: TaskRecord(task),
      });
    }
    default:
      return state;
  }
};

export default taskReducer;
