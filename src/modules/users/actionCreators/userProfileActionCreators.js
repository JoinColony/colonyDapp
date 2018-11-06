/* @flow */

import { USER_PROFILE_FETCH } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const fetchUserProfile = (username: string) => ({
  type: USER_PROFILE_FETCH,
  payload: { username },
});
