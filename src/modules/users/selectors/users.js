/* @flow */

import { createSelector } from 'reselect';

// TODO should not need /index here
import type { UserRecord as User, Users, UsersRecord } from '~types/index';

type State = { user: { users: UsersRecord } };

type UserKeySelector = (state: State) => UsersRecord;
type UsersSelector = (userState: UsersRecord) => Users;
type LoadingSelector = (users: UsersRecord) => boolean;
type UserIdSelector = (state: State, props: Object) => string;
type UserProfileSelector = (state: State, props: Object) => User;

export const userState: UserKeySelector = state => state.user.users;
export const allUsers: UsersSelector = createSelector(
  userState,
  state => state.users,
);
export const isLoading: LoadingSelector = createSelector(
  userState,
  state => state.isLoading,
);
export const targetUserId: UserIdSelector = (_, props) =>
  props ? props.match.params.userId : '';
export const targetUserProfile: UserProfileSelector = createSelector(
  allUsers,
  targetUserId,
  (users, targetId) => users[targetId],
);
