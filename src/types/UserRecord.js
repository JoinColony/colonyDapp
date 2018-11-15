/* @flow */

import type { RecordOf } from 'immutable';
// eslint-disable-next-line max-len
import type { UserActivity } from '../modules/dashboard/components/UserActivities';

export type ProfileProps = {
  orbitStore?: string,
  walletAddress: string,
  username?: string,
  avatar?: string,
  displayName?: string,
  bio?: string,
  website?: string,
  location?: string,
  databases?: Object,
};

export type UserProps = {
  activities: Array<UserActivity>,
  profile: ProfileProps,
};

export type UserRecord = RecordOf<UserProps>;
