/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

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

const defaultValues: $Shape<ActivityFeedItemProps> = {
  id: undefined,
  actionType: undefined,
  date: undefined,
  user: undefined,
  task: undefined,
  organization: undefined,
  domainTag: undefined,
};

const ActivityFeedItem: RecordFactory<ActivityFeedItemProps> = Record(
  defaultValues,
);

export default ActivityFeedItem;
