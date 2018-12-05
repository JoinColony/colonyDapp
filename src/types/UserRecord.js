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
  colonyStores: Object,
  domainStores: Object,
  activitiesStore: string,
  profileStore: string,
};

export type UserProps = {
  activities: Array<UserActivity>,
  profile: ProfileProps,
};

export type UserRecord = RecordOf<UserProps>;
