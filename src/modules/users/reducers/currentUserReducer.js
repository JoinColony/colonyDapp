/* @flow */

import { USER_PROFILE_UPDATE_SUCCESS, SET_CURRENT_USER } from '../actionTypes';

import type { Action } from '~types/index';

import { User } from '../records';

type CurrentUserProfileState = User | null;
const INITIAL_STATE: CurrentUserProfileState = null;

// TODO better types for action payloads
const currentUserReducer = (
  state: CurrentUserProfileState = INITIAL_STATE,
  action: Action,
) => {
  switch (action.type) {
    case SET_CURRENT_USER:
    case USER_PROFILE_UPDATE_SUCCESS: {
      const { user } = action.payload;
      // TODO username is a required property, but we don't have it at this
      // stage; what can we do to improve this?
      return User(user);
    }

    default:
      return state;
  }
};

export default currentUserReducer;
