/* @flow */

import { CURRENT_USER_CREATE, USER_PROFILE_UPDATE_SUCCESS } from '../actionTypes';

import type { Action } from '~types/index';

import { User } from '../records';

type State = User | null;

const INITIAL_STATE = null;

// TODO better types for action payloads
const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CURRENT_USER_CREATE:
    case USER_PROFILE_UPDATE_SUCCESS: {
      const { walletAddress, set } = action.payload;
      // TODO username is a required property, but we don't have it yet
      const username = set.username || walletAddress;
      return User({ walletAddress, ...set, username });
    }
    default:
      return state;
  }
};

export default currentUserReducer;
