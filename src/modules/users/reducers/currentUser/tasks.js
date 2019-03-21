/* @flow */

import { Set as ImmutableSet } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';

import type { DataRecordType, CurrentUserTasksType } from '~immutable';
import type { ReducerType } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserTasksType>;
type Actions = {
  TASK_FETCH_IDS_FOR_CURRENT_USER: *,
  TASK_FETCH_IDS_FOR_CURRENT_USER_ERROR: *,
  TASK_FETCH_IDS_FOR_CURRENT_USER_SUCCESS: *,
};

// TODO in #755 (user logout) unset this state
const currentUserTasksReducer: ReducerType<State, Actions> = (
  state = DataRecord({ record: ImmutableSet() }),
  action,
) => {
  switch (action.type) {
    case ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER_SUCCESS: {
      const record = ImmutableSet(action.payload);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    default:
      return state;
  }
};

export default withDataRecord<State, Actions>(
  ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER,
)(currentUserTasksReducer);
