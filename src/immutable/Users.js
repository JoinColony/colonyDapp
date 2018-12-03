/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UserRecord } from './User';
import type { Address } from '~types';

export type UsersProps = {
  avatars: ImmutableMap<string, string>,
  isLoading?: boolean,
  users: ImmutableMap<Address, UserRecord>,
};

export type UsersRecord = RecordOf<UsersProps>;

const defaultValues: UsersProps = {
  avatars: new ImmutableMap(),
  isLoading: false,
  users: new ImmutableMap(),
};

const Users: RecordFactory<UsersProps> = Record(defaultValues);

export default Users;
