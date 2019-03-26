/* @flow */

import { Set as ImmutableSet } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';

import type { DataRecordType, CurrentUserColoniesType } from '~immutable';
import type { ReducerType } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserColoniesType>;
type Actions = {
  COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER: *,
  COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_ERROR: *,
  COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_SUCCESS: *,
  COLONY_SUBSCRIBE: *,
  COLONY_SUBSCRIBE_ERROR: *,
  COLONY_SUBSCRIBE_SUCCESS: *,
};

// TODO in #755 (user logout) unset this state
const currentUserColoniesReducer: ReducerType<State, Actions> = (
  state = DataRecord({ record: ImmutableSet() }),
  action,
) => {
  switch (action.type) {
    case ACTIONS.COLONY_SUBSCRIBE_SUCCESS: {
      const record = (state.record || ImmutableSet()).union([action.payload]);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    case ACTIONS.COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_SUCCESS: {
      const record = (state.record || ImmutableSet()).union(action.payload);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    default:
      return state;
  }
};

export default withDataRecord<State, Actions>(
  new Set([
    ACTIONS.COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER,
    ACTIONS.COLONY_SUBSCRIBE,
  ]),
)(currentUserColoniesReducer);
