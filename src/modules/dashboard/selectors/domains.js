/* @flow */

import { createSelector } from 'reselect';

import type { RootState, ENSName } from '~types';
import type { DomainRecord, DataRecord, DomainId } from '~immutable';

import type { AllDomainsState, DomainsMap } from '../types';

import ns from '../namespace';

/*
 * Domains selector types
 */
type AllDomainsSelector = (state: RootState) => AllDomainsState;
type ColonyDomainsSelector = (
  state: RootState,
  props: { colonyENSName: ENSName },
) => DomainsMap;
type SingleDomainSelector = (
  state: RootState,
  props: { colonyENSName: ENSName },
) => ?DataRecord<DomainRecord>;
type SingleDomainTaskIdsSelector = (
  state: RootState,
  props: { colonyENSName: ENSName, domainId: DomainId },
) => $PropertyType<DomainRecord, 'taskIds'>;

/*
 * Domains selectors
 */
export const allDomainsSelector: AllDomainsSelector = createSelector(
  (state: RootState) => state[ns].allDomains,
);
export const colonyDomainsSelector: ColonyDomainsSelector = createSelector(
  allDomainsSelector,
  (state, props) => props.colonyENSName,
  (allDomains, colonyENSName) => allDomains.get(colonyENSName),
);
export const singleDomainSelector: SingleDomainSelector = createSelector(
  colonyDomainsSelector,
  (state, props) => props.domainId,
  (domains, domainId) => domains.get(domainId),
);
export const singleDomainTaskIdsSelector: SingleDomainTaskIdsSelector = createSelector(
  singleDomainSelector,
  domain => domain.get('taskIds'),
);
