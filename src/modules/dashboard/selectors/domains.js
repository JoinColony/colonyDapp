/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import ns from '../namespace';

import type { DomainRecord } from '~immutable';

type RootState = {
  [typeof ns]: {
    domains: ImmutableMap<string, DomainRecord>,
  },
};

export const allDomains = (state: RootState) => state[ns].domains;

export const singleDomain = (state: RootState, name: string) =>
  allDomains(state).get(name);
