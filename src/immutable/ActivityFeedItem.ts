import { $ReadOnly } from 'utility-types';

import { Record } from 'immutable';

export type ActivityAction = 'addedSkillTag' | 'assignedUser' | 'commentedOn';

interface Shared {
  actionType: ActivityAction;
  date: Date;
  domainTag: string;
  id: number;
  organization: string;
  task: string;
  user?: string;
}

export type ActivityFeedItemType = $ReadOnly<Shared>;

const defaultValues: Shared = {
  actionType: undefined,
  date: undefined,
  domainTag: undefined,
  id: undefined,
  organization: undefined,
  task: undefined,
  user: undefined,
};

export const ActivityFeedItemRecord: Record.Factory<Shared> = Record(
  defaultValues,
);

export default ActivityFeedItemRecord;
