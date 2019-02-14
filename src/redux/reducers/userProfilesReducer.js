/* @flow */

import { List, Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { UserRecord, UserProfileRecord, UserActivityRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserRecordType, UsersMap } from '~immutable';
import type { ReducerType } from '~redux';

const userProfilesReducer: ReducerType<
  UsersMap,
  {|
    USER_ACTIVITIES_FETCH_SUCCESS: *,
    USER_PROFILE_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_PROFILE_FETCH_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      const profile = UserProfileRecord(payload);
      const recordPath = [...keyPath, 'record'];
      return state.getIn(recordPath)
        ? state.setIn([...recordPath, 'profile'], profile)
        : state.setIn(recordPath, UserRecord({ profile }));
    }

    case ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS: {
      const {
        meta: { keyPath },
        payload: { activities },
      } = action;
      const recordPath = [...keyPath, 'record'];
      return state.hasIn(recordPath)
        ? state.setIn(
            [...recordPath, 'activities'],
            List.of(
              ...activities.map(activity => UserActivityRecord(activity)),
            ),
          )
        : state;
    }

    default:
      return state;
  }
};

export default withDataReducer<UsersMap, UserRecordType>(
  new Set([ACTIONS.USER_PROFILE_FETCH, ACTIONS.USER_ACTIVITIES_FETCH]),
  ImmutableMap(),
)(userProfilesReducer);
