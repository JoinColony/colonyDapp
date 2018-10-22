// @flow
import {
  SET_CURRENT_USER,
  SET_CURRENT_USER_ERROR,
  SET_USER_PROFILE,
  SET_USER_PROFILE_ERROR,
} from '../actionTypes';

export const setCurrentUserError = error => ({
  type: SET_CURRENT_USER_ERROR,
  payload: { error },
});

export const setCurrentUser = (user, walletAddress) => ({
  type: SET_CURRENT_USER,
  payload: { set: user, walletAddress },
});

export const updateUserProfileError = error => ({
  type: SET_USER_PROFILE_ERROR,
  payload: { error },
});

export const updateUserProfile = (user, walletAddress) => ({
  type: SET_USER_PROFILE,
  payload: { set: user, walletAddress },
});
