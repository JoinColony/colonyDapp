/* @flow */

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

import type { Action } from '~types/index';

import { User, UserProfilesState } from '../records';

const INITIAL_STATE: any = UserProfilesState();

// TODO better types for action payloads
const userProfilesReducer = (state: any = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case USER_PROFILE_FETCH: {
      return state.merge({ isLoading: true });
    }

    case USER_PROFILE_FETCH_SUCCESS: {
      const { walletAddress, user } = action.payload;
      const userProfiles = state.userProfiles.set(
        walletAddress,
        User({ walletAddress, ...user }),
      );
      return state.merge({
        isLoading: false,
        isError: false,
        userProfiles,
      });
    }

    case USER_PROFILE_FETCH_ERROR: {
      return state.merge({
        isLoading: false,
        isError: true,
      });
    }

    default:
      return state;
  }
};

export default userProfilesReducer;
