/* @flow */

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

import type { Action } from '~types/index';

import { User, Users } from '../records';

const INITIAL_STATE = Users({});

// TODO better types for action payloads
const usersReducer = (state: Users = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case USER_PROFILE_FETCH:
      return state.set('isLoading', true);

    case USER_PROFILE_FETCH_SUCCESS: {
      const { walletAddress, user } = action.payload;
      return state
        .setIn(['users', walletAddress], User({ walletAddress, ...user }))
        .merge({
          isLoading: false,
          isError: false,
        });
    }

    case USER_PROFILE_FETCH_ERROR:
      return state.set('isLoading', false);

    default:
      return state;
  }
};

export default usersReducer;
