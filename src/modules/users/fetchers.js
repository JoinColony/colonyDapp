/* @flow */

import {
  currentUserColonyPermissionsSelector,
  userAvatarByAddressSelector,
  singleUserSelector,
  singleUserByUsernameSelector,
} from './selectors';
import {
  userPermissionsFetch,
  userFetch,
  userByUsernameFetch,
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

export const userByUsernameFetcher = Object.freeze({
  fetch: userByUsernameFetch,
  select: singleUserByUsernameSelector,
});

export const userAvatarByAddressFetcher = Object.freeze({
  fetch: userAvatarFetch,
  select: userAvatarByAddressSelector,
  ttl: 30 * 60 * 1000,
});
