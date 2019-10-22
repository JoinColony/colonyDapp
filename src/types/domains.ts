import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { ROLES } from '~constants';
import { DomainRecord, DomainType } from '~immutable/index';

export type DomainsMap = ImmutableMap<DomainRecord['id'], DomainRecord> & {
  toJS(): Record<string, DomainType>;
};

export type DomainsMapType = Record<string, DomainType>;

export type RoleSet = ImmutableSet<ROLES>;

export type RoleSetType = ROLES[];
