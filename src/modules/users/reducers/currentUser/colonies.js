/* @flow */

import { Set as ImmutableSet } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';

import type { DataRecordType, CurrentUserColoniesType } from '~immutable';
import type { ReducerType } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<CurrentUserColoniesType>;
type Actions = {
  USER_COLONY_SUBSCRIBE: *,
  USER_COLONY_SUBSCRIBE_ERROR: *,
  USER_COLONY_SUBSCRIBE_SUCCESS: *,
  USER_SUBSCRIBED_COLONIES_FETCH: *,
  USER_SUBSCRIBED_COLONIES_FETCH_ERROR: *,
  USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS: *,
};

// TODO in #755 (user logout) unset this state
const currentUserColoniesReducer: ReducerType<State, Actions> = (
  state = DataRecord({ record: ImmutableSet() }),
  action,
) => {
  switch (action.type) {
    case ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS: {
      const record = (state.record || ImmutableSet()).union([action.payload]);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    case ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS: {
      const record = (state.record || ImmutableSet()).union(action.payload);
      return state.merge({ error: undefined, record, isFetching: false });
    }
    default:
      return state;
  }
};

export default withDataRecord<State, Actions>(
  new Set([
    ACTIONS.USER_COLONY_SUBSCRIBE,
    ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH,
  ]),
)(currentUserColoniesReducer);
