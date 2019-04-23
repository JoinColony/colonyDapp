/* @flow */

import { Set as ImmutableSet } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';

import type { DataRecordType, CurrentUserTasksType } from '~immutable';
import type { ReducerType } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserTasksType>;
type Actions = {
  USER_TASK_SUBSCRIBE_SUCCESS: *,
  USER_SUBSCRIBED_TASKS_FETCH: *,
  USER_SUBSCRIBED_TASKS_FETCH_ERROR: *,
  USER_SUBSCRIBED_TASKS_FETCH_SUCCESS: *,
};

// TODO in #755 (user logout) unset this state
const currentUserTasksReducer: ReducerType<State, Actions> = (
  state = DataRecord(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.USER_TASK_SUBSCRIBE_SUCCESS: {
      const { draftId } = action.payload;
      return state.merge({
        error: undefined,
        record: state.record
          ? state.record.add(draftId)
          : ImmutableSet([draftId]),
        isFetching: false,
        lastFetchedAt: new Date(),
      });
    }

    case ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS:
      return state.set('record', ImmutableSet(action.payload));

    default:
      return state;
  }
};

export default withDataRecord<State, Actions>(
  ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
)(currentUserTasksReducer);
