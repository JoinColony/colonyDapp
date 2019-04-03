/* @flow */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { UserRecordType, DataRecordType } from '~immutable';

export type UsernamesMap = ImmutableMapType<
  string, // address
  DataRecordType<string>, // username
>;

export type UsersMap = ImmutableMapType<
  string, // address
  DataRecordType<UserRecordType>,
>;

export type AllUsersProps = {|
  usernames: UsernamesMap,
  users: UsersMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type AllUsersRecord = RecordOf<AllUsersProps>;
