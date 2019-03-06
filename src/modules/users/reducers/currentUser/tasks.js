/* @flow */

import { List } from 'immutable';

import { ACTIONS } from '~redux';
import {
  DataRecord,
  CurrentUserTasksRecord,
  TaskReferenceRecord,
} from '~immutable';

import type { CurrentUserTasksRecordType, DataRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const currentUserTasksReducer: ReducerType<
  DataRecordType<CurrentUserTasksRecordType>,
  {|
    USER_TASK_IDS_FETCH: *,
    USER_TASK_IDS_FETCH_ERROR: *,
    USER_TASK_IDS_FETCH_SUCCESS: *,
  |},
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_TASK_IDS_FETCH: {
      return state.set('isFetching', true);
    }
    case ACTIONS.USER_TASK_IDS_FETCH_ERROR: {
      const { message: error } = action.payload;
      return state.merge({ error, isFetching: false });
    }
    case ACTIONS.USER_TASK_IDS_FETCH_SUCCESS: {
      const { open, closed } = action.payload;
      const record = CurrentUserTasksRecord({
        open: List(open.map(item => TaskReferenceRecord(item))),
        closed: List(closed.map(item => TaskReferenceRecord(item))),
      });
      return state.merge({ record, isFetching: false });
    }
    default:
      return state;
  }
};

export default currentUserTasksReducer;
