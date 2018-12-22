/* @flow */

import { createSelector } from 'reselect';

import type { Map as ImmutableMap } from 'immutable';

import ns from '../namespace';

import type { DomainRecord } from '~immutable';

type RootState = {
  [typeof ns]: {
    domains: ImmutableMap<string, DomainRecord>,
  },
};

export const allDomains = (state: RootState) => state[ns].domains;

export const colonyDomains = (colonyName: string) =>
  createSelector(
    allDomains,
    domains => domains.get(colonyName),
  );

export const singleDomain = (colonyName: string, domainName: string) =>
  createSelector(
    colonyDomains(colonyName),
    domains => domains.get(domainName),
  );

export const domainAddressSelector = (colonyName: string, domainName: string) =>
  createSelector(
    singleDomain(colonyName, domainName),
    domain => domain.getIn(['domain', 'id']),
  );
