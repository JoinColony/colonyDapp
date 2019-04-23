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
    CURRENT_USER_GET_BALANCE_SUCCESS: *,
    USER_ACTIVITIES_FETCH_SUCCESS: *,
    USER_AVATAR_REMOVE_SUCCESS: *,
    USER_AVATAR_UPLOAD_SUCCESS: *,
    USER_FETCH_SUCCESS: *,
    USER_PROFILE_UPDATE_SUCCESS: *,
    USERNAME_CREATE_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload,
      } = action;
      const profile = UserProfileRecord(payload);
      const recordPath = [key, 'record'];
      const nextState = state.setIn([key, 'lastFetchedAt'], new Date());
      return nextState.getIn(recordPath)
        ? nextState.setIn([...recordPath, 'profile'], profile)
        : nextState.setIn(recordPath, UserRecord({ profile }));
    }

    case ACTIONS.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return state.mergeDeepIn(
        [walletAddress],
        DataRecord({
          error: undefined,
          record: UserRecord({
            profile: UserProfileRecord({
              ...profileData,
              walletAddress,
              balance,
            }),
          }),
          lastFetchedAt: new Date(),
        }),
      );
    }

    case ACTIONS.USER_PROFILE_UPDATE_SUCCESS: {
      const { walletAddress, ...update } = action.payload;
      return state.mergeDeepIn(
        [walletAddress],
        DataRecord({
          error: undefined,
          record: UserRecord({ profile: UserProfileRecord(update) }),
          lastFetchedAt: new Date(),
        }),
      );
    }

    case ACTIONS.USERNAME_CREATE_SUCCESS: {
      const {
        from,
        params: { username },
      } = action.payload;
      return state
        .setIn([from, 'record', 'profile', 'username'], username)
        .setIn([from, 'lastFetchedAt'], new Date());
    }

    case ACTIONS.USER_AVATAR_UPLOAD_SUCCESS: {
      const { hash, walletAddress } = action.payload;
      return state
        .setIn([walletAddress, 'record', 'profile', 'avatarHash'], hash)
        .setIn([walletAddress, 'lastFetchedAt'], new Date());
    }

    case ACTIONS.USER_AVATAR_REMOVE_SUCCESS: {
      const { walletAddress } = action.payload;
      return state
        .deleteIn([walletAddress, 'record', 'profile', 'avatarHash'])
        .setIn([walletAddress, 'lastFetchedAt'], new Date());
    }

    case ACTIONS.CURRENT_USER_GET_BALANCE_SUCCESS: {
      const { balance, walletAddress } = action.payload;
      return state
        .setIn([walletAddress, 'record', 'profile', 'balance'], balance)
        .setIn([walletAddress, 'lastFetchedAt'], new Date());
    }

    default:
      return state;
  }
};

export default withDataRecordMap<UsersMap, UserRecordType>(
  new Set([ACTIONS.USER_FETCH, ACTIONS.USER_ACTIVITIES_FETCH]),
  ImmutableMap(),
)(userProfilesReducer);
