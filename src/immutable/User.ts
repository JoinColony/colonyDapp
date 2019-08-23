import { $ReadOnly } from 'utility-types';

import { RecordOf, List, Record } from 'immutable';

import {
  UserProfileRecord,
  UserProfileType,
  UserProfileRecordType,
} from './UserProfile';

import { InboxItemRecordType, InboxItemType } from './InboxItem';

interface UserRecordProps {
  activities: List<InboxItemRecordType>;
  profile: UserProfileRecordType;
}

export type UserType = $ReadOnly<{
  activities: InboxItemType[];
  profile: UserProfileType;
}>;

export type UserRecordType = RecordOf<UserRecordProps>;

const defaultValues: UserRecordProps = {
  profile: UserProfileRecord(),
  activities: List(),
};

export const UserRecord: Record.Factory<UserRecordProps> = Record(
  defaultValues,
);

export default UserRecord;
