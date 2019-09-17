import { Map as ImmutableMap, Record } from 'immutable';

import { UserRecord, FetchableDataRecord } from '~immutable/index';

export type UsernamesMap = ImmutableMap<
  string, // address
  FetchableDataRecord<string>
>;

export type UsersMap = ImmutableMap<
  string, // address
  FetchableDataRecord<UserRecord>
>;

export interface AllUsersProps {
  usernames: UsernamesMap;
  users: UsersMap;
}

export class AllUsersRecord extends Record<AllUsersProps>({
  usernames: ImmutableMap(),
  users: ImmutableMap(),
}) {}
