import { List, Record } from 'immutable';

import { DefaultValues } from '~types/index';

import {
  UserProfileRecord,
  UserProfileType,
  UserProfileRecordType,
} from './UserProfile';
import { InboxItemRecord, InboxItemType } from './InboxItem';

interface UserRecordProps {
  activities?: List<InboxItemRecord>;
  profile?: UserProfileRecordType;
}

export type UserType = Readonly<{
  activities: InboxItemType[];
  profile: UserProfileType;
}>;

const defaultValues: DefaultValues<UserRecordProps> = {
  profile: UserProfileRecord(),
  activities: List(),
};

export class UserRecord extends Record<UserRecordProps>(defaultValues) {}

export const User = (p?: UserRecordProps) => new UserRecord(p);
