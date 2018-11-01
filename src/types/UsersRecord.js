/* @flow */

import type { Map as ImmutableMap, RecordOf } from 'immutable';

import type { UserRecord as User } from './UserRecord';

type WalletAddress = string;

export type Users = ImmutableMap<WalletAddress, User>;

export type UsersProps = {
  users: Users,
  isLoading?: boolean,
  isError?: boolean,
};

export type UsersRecord = RecordOf<UsersProps>;
