/* @flow */

import {
  colonyRolesSelector,
  colonyDomainsSelector,
  colonyENSNameSelector,
  colonySelector,
} from './selectors';
import {
  currentUserTasksSelector,
  currentUserColoniesSelector,
} from '../users/selectors';
import {
  fetchColony,
  fetchColonyENSName,
  fetchDomains,
  fetchRoles,
} from './actionCreators';
import {
  currentUserFetchColonies,
  currentUserFetchTasks,
} from '../users/actionCreators';

export const colonyFetcher = {
  select: colonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60, // 1 minute
};

export const colonyENSNameFetcher = {
  select: colonyENSNameSelector,
  fetch: fetchColonyENSName,
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
  fetch: currentUserFetchTasks,
  ttl: 1000 * 60,
};

export const currentUserColoniesFetcher = {
  select: currentUserColoniesSelector,
  fetch: currentUserFetchColonies,
  ttl: 1000 * 60,
};
