/* @flow */

import { ACTIONS } from '~redux';

export const fetchUsername = (userAddress: string) => ({
  type: ACTIONS.USERNAME_FETCH,
  payload: { userAddress },
});

export const fetchUserProfile = (username: string) => ({
  type: ACTIONS.USER_PROFILE_FETCH,
  meta: { keyPath: [username] },
});

export const fetchUserAvatar = (hash: string) => ({
  type: ACTIONS.USER_AVATAR_FETCH,
  payload: { hash, key: hash },
});

export const fetchUserTransactions = () => ({
  type: ACTIONS.USER_FETCH_TOKEN_TRANSFERS,
});

export const getCurrentUserBalance = () => ({
  type: ACTIONS.CURRENT_USER_GET_BALANCE,
});
