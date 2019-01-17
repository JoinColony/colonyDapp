/* @flow */

import {
  createTxActionCreator,
  NETWORK_CONTEXT,
} from '../../core/actionCreators';

import {
  USER_PROFILE_FETCH,
  USER_AVATAR_FETCH,
  USERNAME_CREATE_ERROR,
  USERNAME_CREATE_SUCCESS,
} from '../actionTypes';

export const registerUserLabel = createTxActionCreator<{
  username: string,
  orbitDBPath: string,
}>({
  context: NETWORK_CONTEXT,
  methodName: 'registerUserLabel',
  lifecycle: {
    error: USERNAME_CREATE_ERROR,
    sent: USERNAME_CREATE_SUCCESS,
  },
});

export const fetchUserProfile = (username: string) => ({
  type: USER_PROFILE_FETCH,
  payload: { keyPath: [username] },
});

export const fetchUserAvatar = (hash: string) => ({
  type: USER_AVATAR_FETCH,
  payload: { hash, key: hash },
});
