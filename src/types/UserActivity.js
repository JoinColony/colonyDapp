/* @flow */

import type { RecordOf } from 'immutable';

import { activityMessages } from '../modules/dashboard/components/UserActivities';

export type ActivityEvent = $Keys<typeof activityMessages>;

export type ActivityElement = {
  userAction: ActivityEvent,
  colonyName?: string,
  domainName?: string,
  createdAt: Date,
  numberOfStars?: number,
  taskName?: string,
  assignedUser?: string,
};

export type UserActivity = RecordOf<ActivityElement>;
