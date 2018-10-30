/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { USER_PROFILE_CREATE } from '../actionTypes';

import type { Action } from '~types/index';

import { User } from '../records';

type WalletAddress = string;
type UserProfilesState = ImmutableMap<WalletAddress, User>;

const INITIAL_STATE: UserProfilesState = new ImmutableMap();

// TODO better types for action payloads
const userProfilesReducer = (
  state: UserProfilesState = INITIAL_STATE,
  action: Action,
) => {
  switch (action.type) {
    case USER_PROFILE_CREATE: {
      const { walletAddress, set } = action.payload;
      return state.set(walletAddress, User({ walletAddress, ...set }));
    }
    default:
      return state;
  }
};

export default userProfilesReducer;
