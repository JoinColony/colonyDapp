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

const defaultValues: UserActivityProps = {
  assignedUser: undefined,
  colonyName: undefined, // TODO should this be ensName?
  createdAt: new Date(),
  domainName: undefined,
  numberOfStars: undefined,
  taskName: undefined,
  userAction: '',
};

const UserActivity: RecordFactory<UserActivityProps> = Record(defaultValues);

export default UserActivity;
