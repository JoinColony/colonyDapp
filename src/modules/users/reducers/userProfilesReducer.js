/* @flow */

import { List, Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { UserRecord, UserProfileRecord, UserActivityRecord } from '~immutable';

import type { UserRecordType, UsersMap } from '~immutable';
import type { UniqueActionWithKeyPath } from '~types';

import {
  USER_ACTIVITIES_FETCH,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

const userProfilesReducer = (
  state: UsersMap = ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case USER_PROFILE_FETCH_SUCCESS: {
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

    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      const activity = UserActivityRecord(payload);
      const recordPath = [...keyPath, 'record'];
      return state.getIn(recordPath)
        ? state.updateIn([...recordPath, 'activities'], activities =>
            activities.insert(activity),
          )
        : state.setIn(recordPath, UserRecord({ activities: List([activity]) }));
    }

    default:
      return state;
  }
};

export default withDataReducer<UsersMap, UserRecordType>(
  new Set([USER_PROFILE_FETCH, USER_ACTIVITIES_FETCH]),
  ImmutableMap(),
)(userProfilesReducer);
