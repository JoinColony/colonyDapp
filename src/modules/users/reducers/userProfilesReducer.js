/* @flow */

import { List, Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { User, UserProfile, UserActivity } from '~immutable';

import type { UserRecord, UsersMap } from '~immutable';
import type { UniqueActionWithKeyPath } from '~types';

import {
  USER_ACTIVITIES_FETCH,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

const userProfilesReducer = (
  state: UsersMap = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case USER_PROFILE_FETCH_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      const profile = UserProfile(payload);
      const recordPath = [...keyPath, 'record'];
      return state.getIn(recordPath)
        ? state.setIn([...recordPath, 'profile'], profile)
        : state.setIn(recordPath, User({ profile }));
    }

    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      const activity = UserActivity(payload);
      const recordPath = [...keyPath, 'record'];
      return state.getIn(recordPath)
        ? state.updateIn([...recordPath, 'activities'], activities =>
            activities.insert(activity),
          )
        : state.setIn(recordPath, User({ activities: List([activity]) }));
    }

    default:
      return state;
  }
};

export default withDataReducer<string, UserRecord>(
  new Set([USER_PROFILE_FETCH, USER_ACTIVITIES_FETCH]),
)(userProfilesReducer);
