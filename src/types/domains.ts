import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { ColonyRole } from '@colony/colony-js';

import { DomainRecord, DomainType } from '~immutable/index';

export type DomainsMap = ImmutableMap<DomainRecord['id'], DomainRecord> & {
  toJS(): Record<string, DomainType>;
};

export type DomainsMapType = Record<string, DomainType>;

export type RoleSet = ImmutableSet<ColonyRole>;

export type RoleSetType = ColonyRole[];
