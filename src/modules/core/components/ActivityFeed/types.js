/* @flow */

export type ActivityAction = 'addedSkillTag' | 'assignedUser' | 'commentedOn';

export type Activity = {
  id: number,
  actionType: ActivityAction,
  date: Date,
  user?: string,
  task: string,
  organization: string,
  domainTag: string,
};
