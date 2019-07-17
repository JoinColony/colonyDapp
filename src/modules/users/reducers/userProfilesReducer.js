/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { withDataRecordMap } from '~utils/reducers';
import { UserRecord, UserProfileRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserRecordType, UsersMap } from '~immutable';
import type { ReducerType } from '~redux';

const userProfilesReducer: ReducerType<
  UsersMap,
  {|
    CURRENT_USER_CREATE: *,
    USER_AVATAR_UPLOAD_SUCCESS: *,
    USER_FETCH_SUCCESS: *,
    USER_PROFILE_UPDATE_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return state.mergeDeepIn(
        [walletAddress],
        DataRecord({
          error: undefined,
          lastFetchedAt: new Date(),
          record: UserRecord({
            profile: UserProfileRecord({
              ...profileData,
              walletAddress,
              balance,
            }),
          }),
        }),
      );
    }

    case ACTIONS.USER_PROFILE_UPDATE_SUCCESS: {
      const { walletAddress, ...profile } = action.payload;
      return state.mergeDeepIn([walletAddress, 'record', 'profile'], profile);
    }

    case ACTIONS.USER_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload,
      } = action;
      const profile = UserProfileRecord(payload);
      const recordPath = [key, 'record'];
      return state.getIn(recordPath)
        ? state.setIn([...recordPath, 'profile'], profile)
        : state.setIn(recordPath, UserRecord({ profile }));
    }

    case ACTIONS.USER_AVATAR_UPLOAD_SUCCESS: {
      const { hash, address } = action.payload;
      return state.setIn([address, 'record', 'profile', 'avatarHash'], hash);
    }

    default:
      return state;
  }
};

export default withDataRecordMap<UsersMap, UserRecordType>(
  new Set([ACTIONS.USER_FETCH]),
  ImmutableMap(),
)(userProfilesReducer);
