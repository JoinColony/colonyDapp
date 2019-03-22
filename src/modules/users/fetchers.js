/* @flow */

import {
  currentUserColonyPermissionsSelector,
  currentUserTokensSelector,
  currentUserTransactionsSelector,
  userAvatarByAddressSelector,
  userByUsernameSelector,
  userSelector,
} from './selectors';
import {
  userAvatarFetch,
  userByUsernameFetch,
  userFetch,
  userPermissionsFetch,
  userTokensFetch,
  userTokenTransfersFetch,
} from './actionCreators';

export const currentUserColonyPermissionsFetcher = Object.freeze({
  fetch: userPermissionsFetch,
  select: currentUserColonyPermissionsSelector,
  ttl: 60 * 1000,
});

export const currentUserTokensFetcher = Object.freeze({
  fetch: userTokensFetch,
  select: currentUserTokensSelector,
  ttl: 60 * 1000,
});

export const currentUserTokenTransfersFetcher = Object.freeze({
  fetch: userTokenTransfersFetch,
  select: currentUserTransactionsSelector,
  ttl: 60 * 1000,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: userSelector,
  ttl: 60 * 1000,
});

export const userByUsernameFetcher = Object.freeze({
  fetch: userByUsernameFetch,
  select: userByUsernameSelector,
  ttl: 60 * 1000,
});

export const userAvatarByAddressFetcher = Object.freeze({
  fetch: userAvatarFetch,
  select: userAvatarByAddressSelector,
  ttl: 30 * 60 * 1000,
});
