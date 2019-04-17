/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { withDataRecordMap } from '~utils/reducers';
import { UserRecord, UserProfileRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserRecordType, UsersMap } from '~immutable';
import type { ReducerType } from '~redux';

const userProfilesReducer: ReducerType<
  UsersMap,
  {|
    USER_ACTIVITIES_FETCH_SUCCESS: *,
    USER_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_FETCH_SUCCESS: {
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
    default:
      return state;
  }
};

export default withDataRecordMap<UsersMap, UserRecordType>(
  new Set([ACTIONS.USER_FETCH, ACTIONS.USER_ACTIVITIES_FETCH]),
  ImmutableMap(),
)(userProfilesReducer);
