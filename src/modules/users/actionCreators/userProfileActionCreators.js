/* @flow */

import type { Action } from '~redux';
import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

export const fetchUsername = (
  userAddress: string,
): Action<typeof ACTIONS.USERNAME_FETCH> => ({
  type: ACTIONS.USERNAME_FETCH,
  payload: { userAddress },
});

export const fetchUserProfile = (
  username: string,
): Action<typeof ACTIONS.USER_PROFILE_FETCH> => ({
  type: ACTIONS.USER_PROFILE_FETCH,
  meta: { keyPath: [username] },
  payload: { username },
});

export const fetchUserAvatar = (
  username: string,
): Action<typeof ACTIONS.USER_AVATAR_FETCH> => ({
  type: ACTIONS.USER_AVATAR_FETCH,
  payload: { username },
});

export const fetchUserTransactions = (): Action<
  typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
> => ({
  type: ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
});

export const getCurrentUserBalance = (): Action<
  typeof ACTIONS.CURRENT_USER_GET_BALANCE,
> => ({
  type: ACTIONS.CURRENT_USER_GET_BALANCE,
});

export const fetchColonyPermissions = (
  ensName: ENSName,
): Action<typeof ACTIONS.USER_PERMISSIONS_FETCH> => ({
  type: ACTIONS.USER_PERMISSIONS_FETCH,
  payload: { ensName },
  meta: { keyPath: [ensName] },
});
