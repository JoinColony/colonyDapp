/* @flow */

import type { RecordOf } from 'immutable';

import messages from './activityMessages';

export type ActivityEvent = $Keys<typeof messages>;

type ActivityElement = {
  userAction: ActivityEvent,
  colonyName: string,
  domainName?: string,
  createdAt: Date,
};

export type UserActivity = RecordOf<ActivityElement>;
