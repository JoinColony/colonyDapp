/* @flow */

import { Set as ImmutableSet } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';

import type { DataRecordType, CurrentUserTasksType } from '~immutable';
import type { ReducerType } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserTasksType>;
type Actions = {
  USER_LOGOUT_SUCCESS: *,
  USER_TASK_SUBSCRIBE_SUCCESS: *,
  USER_SUBSCRIBED_TASKS_FETCH: *,
  USER_SUBSCRIBED_TASKS_FETCH_ERROR: *,
  USER_SUBSCRIBED_TASKS_FETCH_SUCCESS: *,
};

const currentUserTasksReducer: ReducerType<State, Actions> = (
  state = DataRecord(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.USER_TASK_SUBSCRIBE_SUCCESS: {
      const { colonyAddress, draftId } = action.payload;
      const entry = [colonyAddress, draftId];
      return state.merge({
        error: undefined,
        record: state.record ? state.record.add(entry) : ImmutableSet(entry),
        isFetching: false,
      });
    }
    case ACTIONS.USER_LOGOUT_SUCCESS: {
      return state.merge({
        error: undefined,
        record: undefined,
        isFetching: false,
      });
    }
    case ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS: {
      const record = ImmutableSet(action.payload);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    default:
      return state;
  }
};

export default withDataRecord<State, Actions>(
  ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
)(currentUserTasksReducer);
