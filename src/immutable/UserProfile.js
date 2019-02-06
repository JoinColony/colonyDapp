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

const defaultProps: $Shape<UserProfileProps> = {
  activitiesStore: undefined,
  avatar: undefined,
  bio: undefined,
  displayName: undefined,
  location: undefined,
  profileStore: undefined,
  username: undefined,
  walletAddress: undefined,
  website: undefined,
};

const UserProfile: RecordFactory<UserProfileProps> = Record(defaultProps);

export default UserProfile;
