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
type CurrentUserStateSelector = (state: RootState) => User;
type UsersSelector = (allUsersState: UsersRecord) => Users;
type LoadingSelector = (users: UsersRecord) => boolean;
type UserIdSelector = (state: RootState, props: Object) => string;
type UserProfileSelector = (state: RootState, props: Object) => User;
type UserOrbitAddressSelector = (state: RootState) => string;

export const allUsersState: AllUsersStateSelector = state => state[ns].allUsers;
export const currentUserState: CurrentUserStateSelector = state =>
  state[ns].currentUser;
export const allUsers: UsersSelector = createSelector(
  allUsersState,
  state => state.users,
);
export const isLoading: LoadingSelector = createSelector(
  allUsersState,
  state => state.isLoading,
);
export const targetUserId: UserIdSelector = (_, props) =>
  props ? props.match.params.userId : '';
export const targetUserProfile: UserProfileSelector = createSelector(
  allUsers,
  targetUserId,
  (users, targetId) => users[targetId],
);
export const userOrbitAddress: UserOrbitAddressSelector = createSelector(
  currentUserState,
  state => state.orbitStore,
);
