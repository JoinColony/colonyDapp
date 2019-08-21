/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import { COLONY_ROLES } from '@colony/colony-js-client';

import type { Address } from '~types';

import type { DataRecordType } from '../../Data';

export type UserRolesObject = { [role: $Keys<typeof COLONY_ROLES>]: boolean };

export type DomainRolesObject = { [userAddress: string]: UserRolesObject };

export type ColonyRolesObject = { [domainId: number]: DomainRolesObject };

export type ColonyRolesMap = ImmutableMapType<
  number,
  ImmutableMapType<
    Address,
    ImmutableMapType<$Keys<typeof COLONY_ROLES>, boolean>,
  >,
>;

export type AllRolesMap = ImmutableMapType<
  Address,
  DataRecordType<ColonyRolesMap>,
>;
