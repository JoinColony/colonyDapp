import { COLONY_ROLES } from '@colony/colony-js-client';

export type UserRolesObject = Record<keyof COLONY_ROLES, boolean>;

export interface DomainRolesObject {
  [userAddress: string]: UserRolesObject;
}

export interface ColonyRolesObject {
  [domainId: number]: DomainRolesObject;
}
