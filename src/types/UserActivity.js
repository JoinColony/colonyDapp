/* @flow */

// TODO When #160 is implemented this file should move there

import type { RecordOf } from 'immutable';

import messages from './ActivityMessages';

export type ActivityEvent = $Keys<typeof messages>;

type ActivityElement = {
  userAction: ActivityEvent,
  colonyName: string,
  domainName?: string,
  createdAt: Date,
};

export type UserActivity = RecordOf<ActivityElement>;
