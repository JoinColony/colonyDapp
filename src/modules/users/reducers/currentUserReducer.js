/* @flow */

import {
  CURRENT_USER_CREATE,
  USER_ACTIVITIES_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_SUCCESS,
  USERNAME_CREATE_SUCCESS,
  USER_UPLOAD_AVATAR_SUCCESS,
} from '../actionTypes';

import type { Action } from '~types/index';

import { User } from '../records';

type State = User;

const INITIAL_STATE = User({});

const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CURRENT_USER_CREATE: {
      const { walletAddress, user, orbitStore } = action.payload;
      return state.set('profile', { ...user, walletAddress, orbitStore });
    }

    case USER_ACTIVITIES_UPDATE_SUCCESS: {
      const { activities } = action.payload;
      return state.set('activities', activities);
    }
    case USER_PROFILE_UPDATE_SUCCESS: {
      if (state) {
        return state.merge(action.payload);
      }
      return state;
    }
    case USERNAME_CREATE_SUCCESS: {
      // TODO: This might change (maybe transaction: { params: { username }})
      // Or eventData (as soon as it is available)
      const {
        params: { username },
      } = action.payload;
      return state ? state.set('username', username) : state;
    }
    case USER_UPLOAD_AVATAR_SUCCESS: {
      const { hash } = action.payload;
      return state ? state.set('avatar', hash) : state;
    }
    default:
      return state;
  }
};

export default currentUserReducer;
