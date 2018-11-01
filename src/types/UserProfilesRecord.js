/* @flow */

import type { Map as ImmutableMap, RecordOf } from 'immutable';

import type { UserRecord as User } from './UserRecord';

type WalletAddress = string;
type UserProfiles = ImmutableMap<WalletAddress, User>;

export type UserProfilesProps = {
  userProfiles: UserProfiles,
  isLoading?: boolean,
  isError?: boolean,
};

export type UserProfilesRecord = RecordOf<UserProfilesProps>;
