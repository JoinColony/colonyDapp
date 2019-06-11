/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { List, Record } from 'immutable';

import UserProfileRecord from './UserProfile';

import type { InboxItemRecordType, InboxItemType } from './InboxItem';
import type { UserProfileType, UserProfileRecordType } from './UserProfile';

type UserRecordProps = {|
  activities: List<InboxItemRecordType>,
  profile: UserProfileRecordType,
|};

export type UserType = $ReadOnly<{|
  activities: Array<InboxItemType>,
  profile: UserProfileType,
|}>;

export type UserRecordType = RecordOf<UserRecordProps>;

const defaultValues: $Shape<UserRecordProps> = {
  profile: UserProfileRecord(),
  activities: List<InboxItemRecordType>(),
};

const UserRecord: RecordFactory<UserRecordProps> = Record(defaultValues);

export default UserRecord;
