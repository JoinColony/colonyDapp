/* @flow */

import update from 'immutability-helper';

import { SET_USER_PROFILE } from '../actionTypes';

import type { Action } from '~types/';
import type { UserType } from '~types/user';

type State = {
  [walletAddress: string]: UserType,
};

const INITIAL_STATE = {};

const userProfilesReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_USER_PROFILE: {
      const { walletAddress, set } = action.payload;
      return update(state, { [walletAddress]: { $set: set } });
    }

    default:
      return state;
  }
};

export default userProfilesReducer;
