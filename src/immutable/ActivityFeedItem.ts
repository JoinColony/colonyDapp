import { Record } from 'immutable';

import { DefaultValues, RecordToJS } from '~types/index';

export enum ActivityActions {
  ADDED_SKILL_TAG = 'ADDED_SKILL_TAG',
  ASSIGNED_USER = 'ASSIGNED_USER',
  COMMENTED_ON = 'COMMENTED_ON',
}

interface Shared {
  actionType: ActivityActions;
  date?: Date;
  domainTag: string;
  id: number;
  organization: string;
  task: string;
  user?: string;
}

export type ActivityFeedItemType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  actionType: undefined,
  date: new Date(),
  domainTag: undefined,
  id: undefined,
  organization: undefined,
  task: undefined,
  user: undefined,
};

export class ActivityFeedItemRecord extends Record<Shared>(defaultValues)
  implements RecordToJS<ActivityFeedItemType> {}

export const ActivityFeedItem = (p: Shared) => new ActivityFeedItemRecord(p);
