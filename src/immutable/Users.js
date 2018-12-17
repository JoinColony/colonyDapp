/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UserRecord } from './User';
import type { Address } from '~types';
import type { DataRecordMap } from '~utils/reducers';

export type UsersProps = {
  avatars: ImmutableMap<string, string>,
  users: DataRecordMap<Address, UserRecord>,
};

export type UsersRecord = RecordOf<UsersProps>;

const defaultValues: UsersProps = {
  avatars: new ImmutableMap(),
  users: new ImmutableMap(),
};

const Users: RecordFactory<UsersProps> = Record(defaultValues);

export default Users;
