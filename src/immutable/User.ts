import { List, Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

import { UserProfileType, UserProfileRecord } from './UserProfile';
import { InboxItemRecord, InboxItemType } from './InboxItem';

interface UserRecordProps {
  activities?: List<InboxItemRecord>;
  profile: UserProfileRecord;
}

export type UserType = Readonly<{
  activities?: InboxItemType[];
  profile: UserProfileType;
}>;

const defaultValues: DefaultValues<UserRecordProps> = {
  profile: undefined,
  activities: List(),
};

export class UserRecord extends Record<UserRecordProps>(defaultValues)
  implements RecordToJS<UserType> {}

export const User = (p: UserRecordProps) => new UserRecord(p);
