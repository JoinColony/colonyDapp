/* @flow */

import type { Action } from '~redux';
import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

export const userFetch = (
  address: string,
): Action<typeof ACTIONS.USER_FETCH> => ({
  type: ACTIONS.USER_FETCH,
  meta: { keyPath: [address] },
  payload: { address },
});

export const userByUsernameFetch = (
  username: string,
): Action<typeof ACTIONS.USER_BY_USERNAME_FETCH> => ({
  type: ACTIONS.USER_BY_USERNAME_FETCH,
  payload: { username },
});

export const userAvatarFetch = (
  address: string,
  avatarIpfsHash: string,
): Action<typeof ACTIONS.USER_AVATAR_FETCH> => ({
  type: ACTIONS.USER_AVATAR_FETCH,
  meta: { keyPath: [address] },
  payload: { address, avatarIpfsHash },
});

export const userTokensFetch = (): Action<
  typeof ACTIONS.USER_TOKENS_FETCH,
> => ({
  type: ACTIONS.USER_TOKENS_FETCH,
});

export const userTokenTransfersFetch = (): Action<
  typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
> => ({
  type: ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
});

export const currentUserGetBalance = (): Action<
  typeof ACTIONS.CURRENT_USER_GET_BALANCE,
> => ({
  type: ACTIONS.CURRENT_USER_GET_BALANCE,
});

export const userPermissionsFetch = (
  ensName: ENSName,
): Action<typeof ACTIONS.USER_PERMISSIONS_FETCH> => ({
  type: ACTIONS.USER_PERMISSIONS_FETCH,
  payload: { ensName },
  meta: { keyPath: [ensName] },
});

export const userTokensUpdate = (
  tokens: string[],
): Action<typeof ACTIONS.USER_TOKENS_UPDATE> => ({
  type: ACTIONS.USER_TOKENS_UPDATE,
  payload: { tokens },
});
