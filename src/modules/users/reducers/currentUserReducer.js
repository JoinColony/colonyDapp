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
      const { walletAddress } = action.payload;
      // TODO username is a required property, but we don't have it at this
      // stage; what can we do to improve this?
      return new User({ walletAddress, username: '' });
    }
    default:
      return state;
  }
};

export default currentUserReducer;
