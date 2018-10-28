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
    case SET_CURRENT_USER:
    case EDIT_USER_PROFILE_SUCCESS: {
      const { walletAddress } = action.payload;
      // TODO username is a required property, but we don't have it at this
      // stage; what can we do to improve this?
      return new User({ walletAddress, username: '' });
    }

    case EDIT_USER_PROFILE_ERROR: {
    }
    default:
      return state;
  }
};

export default currentUserReducer;
