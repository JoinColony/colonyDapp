/* @flow */

import { createSelector } from 'reselect';

import ns from '../namespace';

import type { RootState } from '~types';

export const allUsers = (state: RootState) => state[ns].allUsers;
export const currentUser = (state: RootState) => state[ns].currentUser;
export const allUsersSelector = createSelector(
  allUsers,
  state => state.users,
);
export const usernamesSelector = createSelector(
  allUsers,
  state => state.usernames,
);
export const avatarsSelector = createSelector(
  allUsers,
  state => state.avatars,
);
export const usernameFromRouter = (state: any, props: Object) =>
  props.match.params.username;
export const usernameFromProps = (state: any, props: Object) =>
  (props.username: string);
export const userAddressFromProps = (state: any, props: Object) =>
  props.userAddress;
export const usernameFromAddressProp = createSelector(
  usernamesSelector,
  userAddressFromProps,
  (usernames, userAddress) => usernames.get(userAddress),
);
export const routerUserSelector = createSelector(
  allUsersSelector,
  usernameFromRouter,
  (users, username) => users.get(username),
);
export const userSelector = createSelector(
  allUsersSelector,
  usernameFromProps,
  (users, username) => users.get(username),
);
export const currentUserAddressSelector = createSelector(
  currentUser,
  user => user.profile.walletAddress,
);
export const userFromAddressSelector = createSelector(
  allUsersSelector,
  usernameFromAddressProp,
  (users, username) => users.get(username),
);
export const avatarSelector = createSelector(
  avatarsSelector,
  (state, { user }) => user && user.getIn(['record', 'profile', 'avatar']),
  (avatars, hash) => avatars.get(hash),
);
export const userProfileStoreAddressSelector = createSelector(
  currentUser,
  state => state.profile.profileStore,
);
// TODO: add back once inboxStore is available
// export const userInboxStoreAddressSelector = createSelector(
//   currentUser,
//   state => state.profile.inboxStore,
// );
export const userActivitiesStoreAddressSelector = createSelector(
  currentUser,
  state => state.profile.activitiesStore,
);
export const walletAddressSelector = createSelector(
  currentUser,
  state => state.profile.walletAddress,
);
export const usernameSelector = createSelector(
  currentUser,
  state => state.profile.username,
);
