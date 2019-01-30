/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { List, Record } from 'immutable';

import UserProfileRecord from './UserProfile';

import type { UserActivityRecordType, UserActivityType } from './UserActivity';
import type { UserProfileType, UserProfileRecordType } from './UserProfile';

type UserRecordProps = {|
  activities: List<UserActivityRecordType>,
  profile: UserProfileRecordType,
|};

export type UserType = $ReadOnly<{|
  activities: Array<UserActivityType>,
  profile: UserProfileType,
|}>;

export type UserRecordType = RecordOf<UserRecordProps>;

const defaultValues: $Shape<UserRecordProps> = {
  profile: UserProfileRecord(),
  activities: List<UserActivityRecordType>(),
};

const UserRecord: RecordFactory<UserRecordProps> = Record(defaultValues);

export default UserRecord;
