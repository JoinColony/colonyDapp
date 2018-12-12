/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

export type ActivityAction =
  | 'addedSkillTag'
  | 'assignedUser'
  | 'commentedOn'
  | ''; // XXX this empty string is only used for setting a default

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

const defaultValues: ActivityFeedItemProps = {
  id: 0,
  actionType: '',
  date: new Date(),
  user: undefined,
  task: '',
  organization: '',
  domainTag: '',
};

const ActivityFeedItem: RecordFactory<ActivityFeedItemProps> = Record(
  defaultValues,
);

export default ActivityFeedItem;
