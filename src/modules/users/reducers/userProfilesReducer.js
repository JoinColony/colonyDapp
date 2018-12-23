/* @flow */

import { List, Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { User, UserProfile, UserActivity } from '~immutable';

import type { UserRecord, UsersProps } from '~immutable';

import {
  USER_ACTIVITIES_FETCH,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

const userProfilesReducer = (
  state: $PropertyType<UsersProps, 'users'> = new ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case USER_PROFILE_FETCH_SUCCESS: {
      const { key, props } = action.payload;
      const profile = UserProfile(props);
      return state.getIn([key, 'record'])
        ? state.setIn([key, 'record', 'profile'], profile)
        : state.setIn([key, 'record'], User({ profile }));
    }

    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const { key, props } = action.payload;
      const activity = UserActivity(props);
      return state.getIn([key, 'record'])
        ? state.updateIn([key, 'record', 'activities'], activities =>
            activities.insert(activity),
          )
        : state.setIn([key, 'record'], User({ activities: List([activity]) }));
    }

    default:
      return state;
  }
};

export default withDataReducer<string, UserRecord>(
  new Set([USER_PROFILE_FETCH, USER_ACTIVITIES_FETCH]),
)(userProfilesReducer);
