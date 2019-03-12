/* @flow */

import {
  currentUserColonyPermissionsSelector,
  userAddressSelector,
  userAvatarByAddressSelector,
  userByAddressSelector,
} from './selectors';
import {
  userPermissionsFetch,
  userFetch,
  userAddressFetch,
  userAvatarFetch,
} from './actionCreators';
import type { RootStateRecord } from '~immutable/state';

export const currentUserColonyPermissionsFetcher = Object.freeze({
  fetch: userPermissionsFetch,
  select: currentUserColonyPermissionsSelector,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: (state: RootStateRecord, address: string) =>
    userByAddressSelector(state, { address }),
});

export const userAddressFetcher = Object.freeze({
  fetch: userAddressFetch,
  select: (state: RootStateRecord, username: string) =>
    userAddressSelector(state, { username }),
});

export const userAvatarByAddressFetcher = Object.freeze({
  fetch: userAvatarFetch,
  select: (state: RootStateRecord, address: string) =>
    userAvatarByAddressSelector(state, { address }),
});
