/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type ActivityAction = 'addedSkillTag' | 'assignedUser' | 'commentedOn';

type Shared = {|
  actionType: ActivityAction,
  date: Date,
  domainTag: string,
  id: number,
  organization: string,
  task: string,
  user?: string,
|};

export type ActivityFeedItemType = $ReadOnly<Shared>;

const defaultValues: $Shape<Shared> = {
  actionType: undefined,
  date: undefined,
  domainTag: undefined,
  id: undefined,
  organization: undefined,
  task: undefined,
  user: undefined,
};

const ActivityFeedItemRecord: RecordFactory<Shared> = Record(defaultValues);

export default ActivityFeedItemRecord;
