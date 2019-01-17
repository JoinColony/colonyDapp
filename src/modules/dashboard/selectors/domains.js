/* @flow */

import { createSelector } from 'reselect';

import type { RootState } from '~types';

import ns from '../namespace';

/*
 * Domains selectors
 */
export const allDomainsSelector = (state: RootState) => state[ns].allDomains;
export const colonyDomainsSelector = createSelector(
  allDomainsSelector,
  (state, props) => props.colonyENSName,
  (allDomains, colonyENSName) => allDomains.get(colonyENSName),
);
export const singleDomainSelector = createSelector(
  colonyDomainsSelector,
  (state, props) => props.domainId,
  (domains, domainId) => domains.get(domainId),
);
export const singleDomainTaskIdsSelector = createSelector(
  singleDomainSelector,
  domain => domain.get('taskIds'),
);
