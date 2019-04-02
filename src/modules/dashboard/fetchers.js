/* @flow */

import {
  colonyRolesSelector,
  colonyDomainsSelector,
  colonySelector,
} from './selectors';
import {
  currentUserTasksSelector,
  currentUserColoniesSelector,
} from '../users/selectors';
import { fetchColony, fetchDomains, fetchRoles } from './actionCreators';
import {
  currentUserFetchColonies,
  currentUserFetchTasks,
} from '../users/actionCreators';

export const colonyFetcher = Object.freeze({
  select: colonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60, // 1 minute
});

export const domainsFetcher = Object.freeze({
  select: colonyDomainsSelector,
  fetch: fetchDomains,
  ttl: 1000 * 60, // 1 minute,
});

export const rolesFetcher = Object.freeze({
  select: colonyRolesSelector,
  fetch: fetchRoles,
  ttl: 1000 * 60,
});

export const currentUserTasksFetcher = Object.freeze({
  select: currentUserTasksSelector,
  fetch: currentUserFetchTasks,
  ttl: 1000 * 60,
});

export const currentUserColoniesFetcher = Object.freeze({
  select: currentUserColoniesSelector,
  fetch: currentUserFetchColonies,
  ttl: 1000 * 60,
});
