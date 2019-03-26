/* @flow */

import {
  colonyAdminsSelector,
  colonyDomainsSelector,
  colonySelector,
} from './selectors';
import { fetchAdmins, fetchColony, fetchDomains } from './actionCreators';

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

export const adminsFetcher = {
  select: colonyAdminsSelector,
  fetch: fetchAdmins,
  ttl: 1000 * 60,
};
