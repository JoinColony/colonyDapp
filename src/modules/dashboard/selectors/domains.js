/* @flow */
import { createSelector } from 'reselect';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

/*
 * Getters
 */
const getColonyDomains = (state: RootStateRecord, ensName: string) =>
  state.getIn([ns, DASHBOARD_ALL_DOMAINS, ensName]);

/*
 * Selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const colonyDomainsSelector = createSelector(
  getColonyDomains,
  domains => domains,
);
