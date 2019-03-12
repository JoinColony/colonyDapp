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

export const currentUserColonyPermissionsFetcher = Object.freeze({
  fetch: userPermissionsFetch,
  select: currentUserColonyPermissionsSelector,
});

export const userFetcher = Object.freeze({
  fetch: userFetch,
  select: (state, address) => userByAddressSelector(state, { address }),
});

export const userAddressFetcher = Object.freeze({
  fetch: userAddressFetch,
  select: (state, username) => userAddressSelector(state, { username }),
});

export const userAvatarByAddressFetcher = Object.freeze({
  fetch: userAvatarFetch,
  select: (state, address) => userAvatarByAddressSelector(state, { address }),
});
