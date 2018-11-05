/* @flow */

import { createSelector } from 'reselect';

import ns from '../namespace';

// TODO should not need /index here
import type { UserRecord as User, Users, UsersRecord } from '~types/index';

type State = { [typeof ns]: UsersRecord };

type UserKeySelector = (state: State) => UsersRecord;
type UsersSelector = (userState: UsersRecord) => Users;
type LoadingSelector = (users: UsersRecord) => boolean;
type ErrorSelector = (users: UsersRecord) => boolean;
type UserIdSelector = (props: Object) => string;
type UserProfileSelector = (state: State, props: Object) => User;

export const userState: UserKeySelector = state => state[ns];
export const allUsers: UsersSelector = createSelector(
  userState,
  state => state.users,
);
export const isLoading: LoadingSelector = createSelector(
  userState,
  state => state.isLoading,
);
export const isError: ErrorSelector = createSelector(
  userState,
  state => state.isError,
);
export const targetUserId: UserIdSelector = props =>
  props.match ? props.match.params.userId : '';
export const targetUserProfile: UserProfileSelector = createSelector(
  [allUsers, targetUserId],
  (users, targetId) => users[targetId],
);
