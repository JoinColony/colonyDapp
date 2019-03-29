/* @flow */

import {
  colonyRolesSelector,
  colonyDomainsSelector,
  colonySelector,
} from './selectors';
import { fetchRoles, fetchColony, fetchDomains } from './actionCreators';

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
