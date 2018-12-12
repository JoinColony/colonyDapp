/* @flow */

import { Record, List } from 'immutable';

import UserProfile from './UserProfile';

import type { UserActivityRecord } from './UserActivity';
import type { UserProfileRecord } from './UserProfile';

export type UserProps = {
  activities: List<UserActivityRecord>,
  profile: UserProfileRecord,
};

const defaultActivities: List<UserActivityRecord> = List();

const defaultValues: UserProps = {
  profile: UserProfile(),
  activities: defaultActivities,
};

class UserClass extends Record(defaultValues)<UserProps> {
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

const User = (props?: {
  activities?: List<UserActivityRecord>,
  profile?: UserProfileRecord,
}) => new UserClass(props);

export default User;
