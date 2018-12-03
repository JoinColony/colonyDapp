/* @flow */

import {
  CURRENT_USER_CREATE,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_ACTIVITIES_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_UPLOAD_AVATAR_SUCCESS,
  USERNAME_CREATE_SUCCESS,
} from '../actionTypes';

import { User, UserProfile } from '~immutable';

import type { UserRecord } from '~immutable';

import type { Action } from '~types';

type State = UserRecord | null;

const INITIAL_STATE = null;

const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CURRENT_USER_CREATE: {
      const { profileData, walletAddress } = action.payload;
      return User({ profile: UserProfile({ ...profileData, walletAddress }) });
    }
    case USER_ACTIVITIES_UPDATE_SUCCESS: {
      const { activities } = action.payload;
      return state ? state.set('activities', activities) : state;
    }
    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const { activities, walletAddress } = action.payload;
      return state &&
        state.getIn(['profile', 'walletAddress']) === walletAddress
        ? state.set('activities', activities)
        : state;
    }
    case USER_PROFILE_UPDATE_SUCCESS:
      return state ? state.merge(action.payload) : state;
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
