import { DomainType } from '~immutable/Domain';
import { Address } from '~types/strings';

// A duplication of the roles constants in colonyJS, but more accessible
export enum ColonyRoles {
  RECOVERY = 0,
  ROOT = 1,
  ARBITRATION = 2,
  ARCHITECTURE = 3,
  ARCHITECTURE_SUBDOMAIN = 4,
  FUNDING = 5,
  ADMINISTRATION = 6,
}

export type DomainRolesObject = Record<Address, Set<ColonyRoles>>;

export type ColonyRolesObject = Record<DomainType['id'], DomainRolesObject>;
