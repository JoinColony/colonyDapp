/* @flow */

import { SET_CURRENT_USER } from '../actionTypes';

import type { Action } from '~types/index';
import type { UserRecord } from '~types/UserRecord';

type State = {
  walletAddress: string,
  profile: UserRecord,
} | null;

const INITIAL_STATE = null;

const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
      const { walletAddress, set } = action.payload;
      return { profile: set, walletAddress };
    }

    default:
      return state;
  }
};

export default currentUserReducer;
