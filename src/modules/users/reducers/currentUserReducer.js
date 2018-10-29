/* @flow */

import { SET_CURRENT_USER } from '../actionTypes';

import type { Action } from '~types/index';

import { User } from '../records';

type State = User | null;

const INITIAL_STATE = null;

// TODO better types for action payloads
const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
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
