/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  EDIT_USER_PROFILE_ERROR,
  EDIT_USER_PROFILE_SUCCESS,
  SET_CURRENT_USER,
} from '../actionTypes';

import type { Action } from '~types/index';

import { User } from '../records';

type CurrentUserProfileState = ImmutableMap<string, User>;
const INITIAL_STATE: CurrentUserProfileState = new ImmutableMap();

// TODO better types for action payloads
const currentUserReducer = (
  state: CurrentUserProfileState = INITIAL_STATE,
  action: Action,
) => {
  switch (action.type) {
    case SET_CURRENT_USER: {
      const { walletAddress, set } = action.payload;
      // TODO username is a required property, but we don't have it yet
      const username = set.username || walletAddress;
      return User({ walletAddress, ...set, username });
    }

    case EDIT_USER_PROFILE_ERROR: {
    }
    default:
      return state;
  }
};

export default currentUserReducer;
