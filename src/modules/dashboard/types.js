/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { Map as ImmutableMapType } from 'immutable';

import type { Address, ENSName } from '~types';
import type {
  ColonyRecord,
  DataRecord,
  DomainId,
  DomainRecord,
  DraftId,
  DraftRecord,
} from '~immutable';

import ns from './namespace';

export type ColoniesMap = ImmutableMapType<ENSName, DataRecord<ColonyRecord>>;

export type ColonyAvatarsMap = ImmutableMapType<string, string>;

export type AllColoniesState = {
  colonies: ColoniesMap,
  avatars: ColonyAvatarsMap,
  ensNames: ImmutableMapType<Address, ENSName>,
};

export type DomainsMap = ImmutableMapType<DomainId, DataRecord<DomainRecord>>;

export type AllDomainsState = ImmutableMapType<ENSName, DomainsMap>;

export type DraftsMap = ImmutableMapType<DraftId, DataRecord<DraftRecord>>;

export type AllDraftsState = ImmutableMapType<ENSName, DraftsMap>;

export type AllCommentsState = ImmutableMapType<DraftId, DraftsMap>;

export type DashboardState = {|
  [typeof ns]: {|
    allColonies: AllColoniesState,
    allDomains: AllDomainsState,
    allDrafts: AllDraftsState,
    allComments: AllCommentsState,
    // TODO: allTasks
  |},
|};
