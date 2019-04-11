/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import { activityMessages } from '../modules/dashboard/components/UserActivities';

export type ActivityEvent = $Keys<typeof activityMessages>;

type Shared = {|
  assignedUser?: string,
  acceptedUser?: string,
  colonyName?: string, // TODO should this be colonyName?
  createdAt: Date,
  domainName?: string,
  numberOfStars?: number,
  taskName?: string,
  userAction: ActivityEvent | '',
|};

export type UserActivityType = $ReadOnly<Shared>;

export type UserActivityRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  assignedUser: undefined,
  acceptedUser: undefined,
  colonyName: undefined, // TODO should this be colonyName?
  createdAt: undefined,
  domainName: undefined,
  numberOfStars: undefined,
  taskName: undefined,
  userAction: undefined,
};

const UserActivityRecord: RecordFactory<Shared> = Record(defaultValues);

export default UserActivityRecord;
