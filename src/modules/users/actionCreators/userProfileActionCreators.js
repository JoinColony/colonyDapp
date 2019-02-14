/* @flow */

import {
  USER_PROFILE_FETCH,
  USER_AVATAR_FETCH,
  USER_FETCH_TOKEN_TRANSFERS,
  USERNAME_FETCH,
  CURRENT_USER_GET_BALANCE,
} from '../actionTypes';

export const fetchUsername = (userAddress: string) => ({
  type: USERNAME_FETCH,
  payload: { userAddress },
});

export const fetchUserProfile = (username: string) => ({
  type: USER_PROFILE_FETCH,
  meta: { keyPath: [username] },
});

export const fetchUserAvatar = (hash: string) => ({
  type: USER_AVATAR_FETCH,
  payload: { hash, key: hash },
});

export const fetchUserTransactions = () => ({
  type: USER_FETCH_TOKEN_TRANSFERS,
});

export const getCurrentUserBalance = () => ({
  type: CURRENT_USER_GET_BALANCE,
});
