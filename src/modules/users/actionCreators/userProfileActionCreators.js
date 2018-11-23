/* @flow */

import { networkTransactionCreated } from '../../core/actionCreators';
import {
  USER_PROFILE_FETCH,
  USER_AVATAR_FETCH,
  USERNAME_CREATE_ERROR,
  USERNAME_CREATE_SUCCESS,
} from '../actionTypes';

export const registerUserLabel = ({ params, ...payload }: *) =>
  networkTransactionCreated<{ username: string, orbitDBPath: string }>({
    params,
    methodName: 'registerUserLabel',
    lifecycle: {
      error: USERNAME_CREATE_ERROR,
      sent: USERNAME_CREATE_SUCCESS,
    },
    ...payload,
  });

export const fetchUserProfile = (username: string) => ({
  type: USER_PROFILE_FETCH,
  payload: { username },
});

export const fetchUserAvatar = (hash: string) => ({
  type: USER_AVATAR_FETCH,
  payload: { hash },
});
