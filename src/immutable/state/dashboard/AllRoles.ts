import { Map as ImmutableMap } from 'immutable';
import { COLONY_ROLES } from '@colony/colony-js-client';

import { Address } from '~types/index';
import { FetchableDataRecord } from '../../FetchableData';

export type UserRolesObject = { [role: string]: boolean };

export type DomainRolesObject = { [userAddress: string]: UserRolesObject };

export type ColonyRolesObject = { [domainId: number]: DomainRolesObject };

export type ColonyRolesMap = ImmutableMap<
  number,
  ImmutableMap<Address, ImmutableMap<keyof COLONY_ROLES | 'pending', boolean>>
>;

export type AllRolesMap = ImmutableMap<
  Address,
  FetchableDataRecord<ColonyRolesMap>
>;
