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

type State = User | null;

const INITIAL_STATE = null;

const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CURRENT_USER_CREATE: {
      const { walletAddress, user, orbitStore } = action.payload;
      return User({ profile: { ...user, walletAddress, orbitStore } });
    }

    case USER_ACTIVITIES_UPDATE_SUCCESS: {
      const { activities } = action.payload;
      return state ? state.set('activities', activities) : state;
    }
    case USER_PROFILE_UPDATE_SUCCESS: {
      return state ? state.merge(action.payload) : state;
    }
    case USERNAME_CREATE_SUCCESS: {
      // TODO: This might change (maybe transaction: { params: { username }})
      // Or eventData (as soon as it is available)
      const {
        params: { username },
      } = action.payload;
      return state ? state.setIn(['profile', 'username'], username) : state;
    }
    case USER_UPLOAD_AVATAR_SUCCESS: {
      const { hash } = action.payload;
      return state ? state.setIn(['profile', 'avatar'], hash) : state;
    }
    default:
      return state;
  }
};

export default currentUserReducer;
