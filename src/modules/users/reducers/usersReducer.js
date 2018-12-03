/* @flow */

import {
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_FETCH_SUCCESS,
  USER_AVATAR_FETCH_SUCCESS,
} from '../actionTypes';

import type { Action } from '~types';

import { User, Users } from '~immutable';

const INITIAL_STATE = Users({});

// TODO better types for action payloads
const usersReducer = (state: Users = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case USER_PROFILE_FETCH:
      return state.set('isLoading', true);

    case USER_PROFILE_FETCH_SUCCESS: {
      const { user } = action.payload;
      return state
        .setIn(['users', user.username], User({ profile: { ...user } }))
        .merge({
          isLoading: false,
        });
    }

    case USER_PROFILE_FETCH_ERROR:
      return state.set('isLoading', false);

    case USER_AVATAR_FETCH_SUCCESS: {
      const { hash, avatarData } = action.payload;
      return state.setIn(['avatars', hash], avatarData);
    }

    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const { activities, walletAddress } = action.payload;
      return state.setIn(['users', walletAddress, 'activities'], activities);
    }
    default:
      return state;
  }
};

export default usersReducer;
