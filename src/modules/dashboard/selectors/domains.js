/* @flow */
import { createSelector } from 'reselect';

import { List, Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

/*
 * Getters
 */
const getColonyDomains = (state: RootStateRecord, ensName: string) =>
  state.getIn([ns, DASHBOARD_ALL_DOMAINS, ensName], ImmutableMap());

// TODO this is not yet needed; consider removing it?
// export const singleDomainSelector = createSelector(
//   colonyDomainsSelector,
//   (state, props) => props.domainId,
//   (domains, domainId) => domains.get(domainId),
// );

/*
 * Selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const colonyDomainsSelector = createSelector(
  getColonyDomains,
  domains =>
    domains
      ? domains
          .map(domain => domain.get('record'))
          .filter(Boolean) // ensure they are loaded
          .sortBy(({ name }) => name.toLowerCase()) // sort by name asc
          .toList()
      : List(),
);
