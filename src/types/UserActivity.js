/* @flow */

import type { RecordOf } from 'immutable';

import { activityMessages } from '../modules/dashboard/components/UserActivities';

export type ActivityEvent = $Keys<typeof activityMessages>;

type ActivityElement = {
  userAction: ActivityEvent,
  colonyName: string,
  domainName?: string,
  createdAt: Date,
};

export type UserActivity = RecordOf<ActivityElement>;
