/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import { activityMessages } from '../modules/dashboard/components/UserActivities';

export type ActivityEvent = $Keys<typeof activityMessages>;

export type UserActivityProps = {
  assignedUser?: string,
  colonyName?: string, // TODO should this be ensName?
  createdAt: Date,
  domainName?: string,
  numberOfStars?: number,
  taskName?: string,
  userAction: ActivityEvent | '',
};

export type UserActivityRecord = RecordOf<UserActivityProps>;

const defaultValues: $Shape<UserActivityProps> = {
  assignedUser: undefined,
  colonyName: undefined, // TODO should this be ensName?
  createdAt: undefined,
  domainName: undefined,
  numberOfStars: undefined,
  taskName: undefined,
  userAction: undefined,
};

const UserActivity: RecordFactory<UserActivityProps> = Record(defaultValues);

export default UserActivity;
