/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address, ENSName } from '../types';

export type UserProfileProps = {
  activitiesStore: string,
  avatar?: string,
  bio?: string,
  displayName?: string,
  location?: string,
  profileStore: string,
  username?: ENSName,
  walletAddress: Address,
  website?: string,
};

export type UserProfileRecord = RecordOf<UserProfileProps>;

// TODO: Ideally, we should be able to validate the required properties
// (`walletAddress`, `profileStore`) before creating a record, rather than using
// empty strings.
const defaultProps: UserProfileProps = {
  activitiesStore: '',
  avatar: undefined,
  bio: undefined,
  displayName: undefined,
  location: undefined,
  profileStore: '',
  username: undefined,
  walletAddress: '',
  website: undefined,
};

const UserProfile: RecordFactory<UserProfileProps> = Record(defaultProps);

export default UserProfile;
