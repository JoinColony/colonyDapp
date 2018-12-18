/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import type { DomainRecord } from '~immutable';

import ns from '../namespace';

import { allDomains, singleDomain } from './domains';

type RootState = {
  [typeof ns]: {
    domains: ImmutableMap<string, DomainRecord>,
  },
};

export const allTasks = (state: RootState) =>
  allDomains(state).reduce(
    (acc, domain) => ({ ...acc, ...domain.get('tasks') }),
    {},
  );

export const taskById = (state: RootState, taskId: string) =>
  allTasks.filter(task => task.id === taskId);

export const tasksStoreAddressSelector = (
  state: RootState,
  domainName: string,
) => singleDomain(state, domainName).get('tasksDatabase');
