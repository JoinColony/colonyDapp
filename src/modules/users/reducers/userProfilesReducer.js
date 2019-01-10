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
      const { keyPath, props } = action.payload;
      const profile = UserProfile(props);
      return state.getIn([...keyPath, 'record'])
        ? state.setIn([...keyPath, 'record', 'profile'], profile)
        : state.setIn([...keyPath, 'record'], User({ profile }));
    }

    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const { keyPath, props } = action.payload;
      const activity = UserActivity(props);
      return state.getIn([...keyPath, 'record'])
        ? state.updateIn([...keyPath, 'record', 'activities'], activities =>
            activities.insert(activity),
          )
        : state.setIn(
            [...keyPath, 'record'],
            User({ activities: List([activity]) }),
          );
    }

    default:
      return state;
  }
};

export default withDataReducer<string, UserRecord>(
  new Set([USER_PROFILE_FETCH, USER_ACTIVITIES_FETCH]),
)(userProfilesReducer);
