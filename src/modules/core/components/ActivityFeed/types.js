/* @flow */

export type Activity = {
  id: number,
  action: string,
  date: Date,
  user?: string,
  task: string,
  organization: string,
  domainTag: string,
};
