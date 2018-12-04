/* @flow */

import type { RecordOf } from 'immutable';
import type { UserActivity } from './UserActivity';

export type ProfileProps = {
  walletAddress: string,
  username?: string,
  avatar?: string,
  displayName?: string,
  bio?: string,
  website?: string,
  location?: string,
};

export type UserProps = {
  activities: Array<UserActivity>,
  profile: ProfileProps,
  profileStore: string,
  colonyStores: Object,
  domainStores: Object,
  activitiesStore: string,
};

export type UserRecord = RecordOf<UserProps>;
