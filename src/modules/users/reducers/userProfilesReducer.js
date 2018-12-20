/* @flow */

import { List, Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { User, UserProfile, UserActivity } from '~immutable';

import type { UserRecord, UsersProps } from '~immutable';

import {
  USER_ACTIVITIES_FETCH,
  USER_ACTIVITIES_FETCH_ERROR,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

const userProfilesReducer = (
  state: $PropertyType<UsersProps, 'users'> = new ImmutableMap(),
) => state;

export default withDataReducer<string, UserRecord>({
  fetch: new Set([USER_PROFILE_FETCH, USER_ACTIVITIES_FETCH]),
  error: new Set([USER_PROFILE_FETCH_ERROR, USER_ACTIVITIES_FETCH_ERROR]),
  success: new Map([
    [
      USER_PROFILE_FETCH_SUCCESS,
      (state, { payload: { key, props } }) => {
        const profile = UserProfile(props);
        return state.getIn([key, 'record'])
          ? state.setIn([key, 'record', 'profile'], profile)
          : state.setIn([key, 'record'], User({ profile }));
      },
    ],
    [
      USER_ACTIVITIES_FETCH_SUCCESS,
      (state, { payload: { key, props } }) => {
        const activity = UserActivity(props);
        return state.getIn([key, 'record'])
          ? state.updateIn([key, 'record', 'activities'], activities =>
              activities.insert(activity),
            )
          : state.setIn(
              [key, 'record'],
              User({ activities: List([activity]) }),
            );
      },
    ],
  ]),
})(userProfilesReducer);
