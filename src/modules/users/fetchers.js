/* @flow */

import {
  currentUserColonyPermissionsSelector,
  userAddressSelector,
  userAvatarByAddressSelector,
  singleUserSelector,
} from './selectors';
import {
  userPermissionsFetch,
  userFetch,
  userAddressFetch,
  userAvatarFetch,
} from './actionCreators';

export const currentUserColonyPermissionsFetcher = Object.freeze({
  fetch: userPermissionsFetch,
  select: currentUserColonyPermissionsSelector,
  ttl: 60 * 1000,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: singleUserSelector,
});

export const userAddressFetcher = Object.freeze({
  fetch: userAddressFetch,
  select: userAddressSelector,
});

export const userAvatarByAddressFetcher = Object.freeze({
  fetch: userAvatarFetch,
  select: userAvatarByAddressSelector,
  ttl: 30 * 60 * 1000,
});
