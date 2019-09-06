import { Map as ImmutableMap, RecordOf } from 'immutable';

import { UserRecordType, FetchableDataRecord } from '~immutable/index';

export type UsernamesMap = ImmutableMap<
  string, // address
  FetchableDataRecord<string>
>;

export type UsersMap = ImmutableMap<
  string, // address
  FetchableDataRecord<UserRecordType>
>;

export interface AllUsersProps {
  usernames: UsernamesMap;
  users: UsersMap;
}

export type AllUsersRecord = RecordOf<AllUsersProps>;
