/* @flow */

import {
  createTxActionCreator,
  NETWORK_CONTEXT,
} from '../../core/actionCreators';

import {
  USER_PROFILE_FETCH,
  USER_AVATAR_FETCH,
  USERNAME_CREATE_ERROR,
  USERNAME_CREATE_TX_CREATED,
  USERNAME_CREATE_SUCCESS,
  USER_FETCH_TOKEN_TRANSFERS,
  USERNAME_FETCH,
  CURRENT_USER_GET_BALANCE,
} from '../actionTypes';

export const registerUserLabel = createTxActionCreator<{
  username: string,
  orbitDBPath: string,
}>({
  context: NETWORK_CONTEXT,
  methodName: 'registerUserLabel',
  lifecycle: {
    created: USERNAME_CREATE_TX_CREATED,
    success: USERNAME_CREATE_SUCCESS,
    error: USERNAME_CREATE_ERROR,
  },
});

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
