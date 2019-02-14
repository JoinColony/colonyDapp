/* @flow */
import { createSelector } from 'reselect';

import { List, Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import {
  DASHBOARD_NAMESPACE as ns,
  DASHBOARD_ALL_DOMAINS,
} from '../misc_constants';

export const allDomainsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_DOMAINS], ImmutableMap());

/*
 * Domains selectors
 */
export const colonyDomainsSelector = createSelector(
  allDomainsSelector,
  (state, colonyENSName) => colonyENSName,
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
export const getColonyDomains = createSelector(
  colonyDomainsSelector,
  colonyDomains =>
    (colonyDomains &&
      colonyDomains
        .filter(domain => domain.has('record')) // ensure they are loaded
        .sortBy(domain => domain.getIn(['record', 'name']).toLowerCase())
        .toList()) ||
    List(),
);
