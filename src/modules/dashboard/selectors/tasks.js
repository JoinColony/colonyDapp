/* @flow */

import { createSelector } from 'reselect';

import type { Map as ImmutableMap } from 'immutable';

import type { DomainRecord } from '~immutable';

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

export const tasksStoreAddressSelector = (singleDomain,
(domain: ImmutableMap<string, DomainRecord>) => domain.get('tasksDatabase'));
