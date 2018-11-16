/* @flow */

import { USER_PROFILE_FETCH, USER_AVATAR_FETCH } from '../actionTypes';

export const fetchUserProfile = (username: string) => ({
  type: USER_PROFILE_FETCH,
  payload: { username },
});

export const fetchUserAvatar = (hash: string) => ({
  type: USER_AVATAR_FETCH,
  payload: { hash },
});
