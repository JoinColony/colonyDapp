import { $ReadOnly } from 'utility-types';

import { Record } from 'immutable';

export enum ActivityActions {
  ADDED_SKILL_TAG = 'addedSkillTag',
  ASSIGNED_USER = 'assignedUser',
  COMMENTED_ON = 'commentedOn',
}

interface Shared {
  actionType: ActivityActions;
  date: Date;
  domainTag: string;
  id: number;
  organization: string;
  task: string;
  user?: string;
}

export type ActivityFeedItemType = $ReadOnly<Shared>;

const defaultValues: Shared = {
  actionType: ActivityActions.ASSIGNED_USER,
  date: new Date(),
  domainTag: '',
  id: 0,
  organization: '',
  task: '',
  user: undefined,
};

export const ActivityFeedItemRecord: Record.Factory<Shared> = Record(
  defaultValues,
);

export default ActivityFeedItemRecord;
