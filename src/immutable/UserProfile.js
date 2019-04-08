/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  avatarHash?: ?string,
  balance?: string,
  bio?: string,
  displayName?: string,
  location?: string,
  username?: string,
  walletAddress: string,
  website?: string,
|};

export type UserProfileType = $ReadOnly<Shared>;

export type UserProfileRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  avatarHash: undefined,
  balance: undefined,
  bio: undefined,
  displayName: undefined,
  location: undefined,
  username: undefined,
  walletAddress: undefined,
  website: undefined,
};

const UserProfileRecord: RecordFactory<Shared> = Record(defaultProps);

export default UserProfileRecord;
