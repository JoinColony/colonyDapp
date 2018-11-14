/* @flow */

import { createSelector } from 'reselect';

// TODO should not need /index here
import type { UserRecord as User, Users, UsersRecord } from '~types/index';

import ns from '../namespace';

type RootState = {
  users: {
    allUsers: UsersRecord,
    currentUser: User,
  },
};

type AllUsersStateSelector = (state: RootState) => UsersRecord;
type CurrentUserSelector = (state: RootState) => User;
type UsersSelector = (allUsersState: UsersRecord) => Users;
type LoadingSelector = (users: UsersRecord) => boolean;
type UserProfileSelector = (state: RootState, props: Object) => User;
type OrbitAddressSelector = (state: RootState) => string;
type WalletAddressSelector = (state: RootState) => string;
type UsernameSelector = (state: RootState) => string;
type UserNameFromRouter = (state: RootState, props: Object) => string;

export const allUsers: AllUsersStateSelector = state => state[ns].allUsers;
export const currentUser: CurrentUserSelector = state => state[ns].currentUser;
export const allUsersSelector: UsersSelector = createSelector(
  allUsers,
  state => state.users,
);
export const isLoadingSelector: LoadingSelector = createSelector(
  allUsers,
  state => state.isLoading,
);
export const usernameFromRouter: UserNameFromRouter = (state, props) =>
  props.match.params.username;
export const userSelector: UserProfileSelector = createSelector(
  allUsersSelector,
  usernameFromRouter,
  (users, username) => users.get(username),
);
export const orbitAddressSelector: OrbitAddressSelector = createSelector(
  currentUser,
  state => state.orbitStore,
);
export const walletAddressSelector: WalletAddressSelector = createSelector(
  currentUser,
  state => state.walletAddress,
);
export const usernameSelector: UsernameSelector = createSelector(
  currentUser,
  state => state.username,
);
