/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import { createNetworkTransaction } from '../../core/actionCreators';
import {
  USER_PROFILE_FETCH,
  USER_AVATAR_FETCH,
  USERNAME_CREATE_ERROR,
  USERNAME_CREATE_SUCCESS,
  USER_FETCH_TOKEN_TRANSFERS,
  USERNAME_FETCH,
} from '../actionTypes';

export const registerUserLabel = (
  params: { username: string, orbitDBPath: string },
  options?: SendOptions,
) =>
  createNetworkTransaction({
    params,
    options,
    methodName: 'registerUserLabel',
    lifecycle: {
      error: USERNAME_CREATE_ERROR,
      sent: USERNAME_CREATE_SUCCESS,
    },
  });

export const fetchUsername = (userAddress: string) => ({
  type: USERNAME_FETCH,
  payload: { userAddress },
});

export const fetchUserProfile = (username: string) => ({
  type: USER_PROFILE_FETCH,
  payload: { keyPath: [username] },
});

export const fetchUserAvatar = (hash: string) => ({
  type: USER_AVATAR_FETCH,
  payload: { hash, key: hash },
});

export const fetchUserTransactions = () => ({
  type: USER_FETCH_TOKEN_TRANSFERS,
});
