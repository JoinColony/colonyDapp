/* @flow */

import { createSelector } from 'reselect';

import { allDomains, singleDomain } from './domains';

export const allTasksSelector = createSelector(
  allDomains,
  domains =>
    domains.reduce((acc, domain) => ({ ...acc, ...domain.get('tasks') }), {}),
);

export const taskByIdSelector = createSelector(
  allTasksSelector,
  (tasks, taskId) => tasks.filter(task => task.id === taskId),
);

export const tasksAddressSelector = (colonyName: string, domainName: string) =>
  createSelector(
    singleDomain(colonyName, domainName),
    domain => domain.getIn(['domain', 'tasksDatabase']),
  );
