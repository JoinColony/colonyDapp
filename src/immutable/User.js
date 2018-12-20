/* @flow */

import { List, Record } from 'immutable';

import UserProfile from './UserProfile';

import type { UserActivityRecord } from './UserActivity';
import type { UserProfileRecord } from './UserProfile';

export type UserProps = {
  activities: List<UserActivityRecord>,
  profile: UserProfileRecord,
};

const defaultActivities: List<UserActivityRecord> = List();

const defaultValues: $Shape<UserProps> = {
  profile: UserProfile(),
  activities: defaultActivities,
};

class UserClass extends Record<UserProps>(defaultValues) {
  /* eslint-disable */
  /*::
  activities: List<UserActivityRecord>;
  profile: UserProfileRecord;
  */
  /* eslint-enable */

  get didClaimProfile() {
    return !!this.profile.username;
  }
}

export type UserRecord = UserClass;

const User = (props?: $Shape<UserProps>) => new UserClass(props);

export default User;
