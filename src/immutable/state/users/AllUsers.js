/* @flow */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { UserRecordType, DataRecordType } from '~immutable';

export type UserAvatarsMap = ImmutableMapType<
  string, // address
  DataRecordType<string>, // Base64 of IPFS image
  // TODO ^ instead, store the IPFS hash, and perhaps use a service worker
  // to download and cache the image data.
>;

export type UsernamesMap = ImmutableMapType<
  string, // address
  DataRecordType<string>, // username
>;

export type UsersMap = ImmutableMapType<
  string, // address
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
