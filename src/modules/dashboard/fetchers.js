/* @flow */

import {
  colonyRolesSelector,
  colonyDomainsSelector,
  colonySelector,
} from './selectors';
import { currentUserTasksSelector } from '../users/selectors';
import {
  fetchColony,
  fetchCurrentUserTasks,
  fetchDomains,
  fetchRoles,
} from './actionCreators';

export const colonyFetcher = {
  select: colonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60, // 1 minute
};

export const domainsFetcher = {
  select: colonyDomainsSelector,
  fetch: fetchDomains,
  ttl: 1000 * 60, // 1 minute,
};

export const rolesFetcher = {
  select: colonyRolesSelector,
  fetch: fetchRoles,
  ttl: 1000 * 60,
};

export const currentUserTasksFetcher = {
  select: currentUserTasksSelector,
  fetch: fetchCurrentUserTasks,
  ttl: 1000 * 60,
};
