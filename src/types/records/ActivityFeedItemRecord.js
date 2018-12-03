/* @flow */

import type { RecordOf } from 'immutable';

export type ActivityAction = 'addedSkillTag' | 'assignedUser' | 'commentedOn';

export type ActivityFeedItemProps = {
  id: number,
  actionType: ActivityAction,
  date: Date,
  user?: string,
  task: string,
  organization: string,
  domainTag: string,
};

export type ActivityFeedItemRecord = RecordOf<ActivityFeedItemProps>;
