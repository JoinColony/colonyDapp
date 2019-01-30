/* @flow */

import { fromJS, List } from 'immutable';

import {
  CURRENT_USER_CREATE,
  CURRENT_USER_GET_BALANCE_SUCCESS,
  USER_ACTIVITIES_FETCH_SUCCESS,
  USER_ACTIVITIES_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_REMOVE_AVATAR_SUCCESS,
  USER_UPLOAD_AVATAR_SUCCESS,
  USERNAME_CREATE_SUCCESS,
} from '../actionTypes';

import { UserRecord, UserProfileRecord } from '~immutable';

import type { UserRecordType } from '~immutable';

import type { Action } from '~types';

type State = UserRecordType | null;

const INITIAL_STATE = null;

// TODO consider using `withDataReducer` here
const currentUserReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return UserRecord({
        profile: UserProfileRecord({ ...profileData, walletAddress, balance }),
      });
    }
    case USER_ACTIVITIES_UPDATE_SUCCESS: {
      return state
        ? state.set('activities', List.of(action.payload.activities))
        : state;
    }
    case USER_ACTIVITIES_FETCH_SUCCESS: {
      const { activities, walletAddress } = action.payload;
      return state &&
        state.getIn(['profile', 'walletAddress']) === walletAddress
        ? state.set('activities', List.of(activities))
        : state;
    }
    case USER_PROFILE_UPDATE_SUCCESS: {
      const {
        activitiesStoreAddress,
        inboxStoreAddress,
        metadataStoreAddress,
        username,
        walletAddress,
        ...profile
      } = action.payload;
      return state ? state.mergeDeepIn(['profile'], fromJS(profile)) : state;
    }
    case USERNAME_CREATE_SUCCESS: {
      const {
        params: { username },
      } = action.payload;
      return state ? state.setIn(['profile', 'username'], username) : state;
    }
    case USER_UPLOAD_AVATAR_SUCCESS: {
      const { hash } = action.payload;
      return state ? state.setIn(['profile', 'avatar'], hash) : state;
    }
    case USER_REMOVE_AVATAR_SUCCESS: {
      return state ? state.setIn(['profile', 'avatar'], undefined) : state;
    }
    case CURRENT_USER_GET_BALANCE_SUCCESS: {
      const { balance } = action.payload;
      return state ? state.setIn(['profile', 'balance'], balance) : state;
    }
    default:
      return state;
  }
};

export default currentUserReducer;
