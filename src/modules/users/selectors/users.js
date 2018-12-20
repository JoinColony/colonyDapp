/* @flow */

import { createSelector } from 'reselect';

import ns from '../namespace';

import type { UserRecord, UsersRecord, DataRecord } from '~immutable';
import type { Address } from '~types';

type RootState = {
  users: {
    allUsers: UsersRecord,
    currentUser: UserRecord,
  },
};

type AllUsersStateSelector = (state: RootState) => UsersRecord;
type CurrentUserSelector = (state: RootState) => UserRecord;
type UsersSelector = (allUsersState: UsersRecord) => UsersRecord;
type AvatarsSelector = (allUsersState: UsersRecord) => *;
type UserProfileSelector = (
  state: RootState,
  props: Object,
) => ?DataRecord<UserRecord>;
type UserAvatarSelector = (state: RootState, props: Object) => string;
type OrbitAddressSelector = (state: RootState) => string;
type WalletAddressSelector = (state: RootState) => Address;
type UsernameSelector = (state: RootState) => string;
type UserNameFromRouter = (state: RootState, props: Object) => string;
type UserNameFromProps = (state: RootState, props: Object) => string;

export const allUsers: AllUsersStateSelector = state => state[ns].allUsers;
export const currentUser: CurrentUserSelector = state => state[ns].currentUser;
export const allUsersSelector: UsersSelector = createSelector(
  allUsers,
  state => state.users,
);
export const avatarsSelector: AvatarsSelector = createSelector(
  allUsers,
  state => state.avatars,
);
export const usernameFromRouter: UserNameFromRouter = (state, props) =>
  props.match.params.username;
export const usernameFromProps: UserNameFromProps = (state, props) =>
  props.username;
export const routerUserSelector: UserProfileSelector = createSelector(
  allUsersSelector,
  usernameFromRouter,
  (users, username) => users.get(username),
);
export const userSelector: UserProfileSelector = createSelector(
  allUsersSelector,
  usernameFromProps,
  (users, username) => users.get(username),
);
export const avatarSelector: UserAvatarSelector = createSelector(
  avatarsSelector,
  (state, { user }) => user && user.getIn(['record', 'profile', 'avatar']),
  (avatars, hash) => avatars.get(hash),
);
export const userProfileStoreAddressSelector: OrbitAddressSelector = createSelector(
  currentUser,
  state => state.profile.profileStore,
);
export const userInboxStoreAddressSelector: OrbitAddressSelector = createSelector(
  currentUser,
  state => state.profile.inboxStore,
);
export const userActivitiesStoreAddressSelector: OrbitAddressSelector = createSelector(
  currentUser,
  state => state.profile.activitiesStore,
);
export const walletAddressSelector: WalletAddressSelector = createSelector(
  currentUser,
  state => state.profile.walletAddress,
);
export const usernameSelector: UsernameSelector = createSelector(
  currentUser,
  state => state.profile.username,
);
