/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { Map as ImmutableMapType } from 'immutable';

import type { ENSName } from '~types';
import type {
  ColonyRecord,
  DataRecord,
  DomainId,
  DomainRecord,
} from '~immutable';

import ns from './namespace';

export type ColoniesMap = ImmutableMapType<ENSName, DataRecord<ColonyRecord>>;

export type ColonyAvatarsMap = ImmutableMapType<string, string>;

export type AllColoniesState = {
  colonies: ColoniesMap,
  avatars: ColonyAvatarsMap,
};

export type DomainsMap = ImmutableMapType<DomainId, DataRecord<DomainRecord>>;

export type AllDomainsState = ImmutableMapType<ENSName, DomainsMap>;

export type DashboardState = {|
  [typeof ns]: {|
    allColonies: AllColoniesState,
    allDomains: AllDomainsState,
    // TODO: allDrafts
    // TODO: allTasks
  |},
|};
