/* @flow */

import { Set as ImmutableSet } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';

import type { DataRecordType, CurrentUserTasksType } from '~immutable';
import type { ReducerType } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserTasksType>;
type Actions = {
  USER_SUBSCRIBED_TASKS_FETCH: *,
  USER_SUBSCRIBED_TASKS_FETCH_ERROR: *,
  USER_SUBSCRIBED_TASKS_FETCH_SUCCESS: *,
};

// TODO in #755 (user logout) unset this state
const currentUserTasksReducer: ReducerType<State, Actions> = (
  state = DataRecord({ record: ImmutableSet() }),
  action,
) => {
  switch (action.type) {
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
