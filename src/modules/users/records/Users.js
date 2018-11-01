/* @flow */

import type { RecordFactory } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UsersProps } from '~types/UsersRecord';

const defaultState: UsersProps = {
  isLoading: false,
  isError: false,
  users: new ImmutableMap(),
};

const Users: RecordFactory<UsersProps> = Record(defaultState);

export default Users;
