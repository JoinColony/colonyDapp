/* @flow */

import type { RecordFactory } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UsersProps } from '~types';

const defaultState: UsersProps = {
  isLoading: false,
  users: new ImmutableMap(),
  avatars: new ImmutableMap(),
};

const Users: RecordFactory<UsersProps> = Record(defaultState);

export default Users;
