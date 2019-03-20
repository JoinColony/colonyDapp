/* @flow */

import { colonyDomainsSelector, singleColonySelector } from './selectors';
import { fetchColony, fetchColonyDomains } from './actionCreators';

export const colonyFetcher = {
  select: singleColonySelector,
  fetch: fetchColony,
  ttl: 1000 * 60, // 1 minute
};

export const domainsFetcher = {
  select: colonyDomainsSelector,
  fetch: fetchColonyDomains,
  ttl: 1000 * 60, // 1 minute,
};
