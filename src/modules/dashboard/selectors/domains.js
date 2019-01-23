/* @flow */
import { createSelector } from 'reselect';

import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

export const allDomainsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_DOMAINS], ImmutableMap());

const sortDomainsByName = (prevDomain, nextDomain) => {
  const prevName = prevDomain.getIn(['record', 'name']).toLowerCase();
  const nextName = nextDomain.getIn(['record', 'name']).toLowerCase();
  if (prevName < nextName) {
    return -1;
  }
  if (prevName > nextName) {
    return 1;
  }
  return 0;
};

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
        .toList()
        .toArray()
        .sort(sortDomainsByName)) ||
    [],
);
