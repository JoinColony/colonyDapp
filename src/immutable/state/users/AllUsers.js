/* @flow */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { Address } from '~types';
import type { UserRecordType, DataRecordType } from '~immutable';

type Username = string;
type Hash = string;

export type UserAvatarsMap = ImmutableMapType<Username, Hash>;

export type UsernamesMap = ImmutableMapType<Address, Username>;

export type UsersMap = ImmutableMapType<
  Username,
  DataRecordType<UserRecordType>,
>;

export type AllUsersProps = {|
  avatars: UserAvatarsMap,
  usernames: UsernamesMap,
  users: UsersMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type AllUsersRecord = RecordOf<AllUsersProps>;
