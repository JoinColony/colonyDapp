import { Map as ImmutableMap, RecordOf } from 'immutable';

import { UserRecordType, DataRecordType } from '~immutable/index';

export type UsernamesMap = ImmutableMap<
  string, // address
  DataRecordType<string>
>;

export type UsersMap = ImmutableMap<
  string, // address
  DataRecordType<UserRecordType>
>;

export interface AllUsersProps {
  usernames: UsernamesMap;
  users: UsersMap;
}

export type AllUsersRecord = RecordOf<AllUsersProps>;
