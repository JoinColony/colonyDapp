import { Map as ImmutableMap } from 'immutable';
import { COLONY_ROLES } from '@colony/colony-js-client';

import { Address } from '~types/index';
import { FetchableDataRecord } from '~immutable/index';

export type ColonyRolesMap = ImmutableMap<
  number,
  ImmutableMap<Address, ImmutableMap<keyof COLONY_ROLES | 'pending', boolean>>
>;

export type AllRolesMap = ImmutableMap<
  Address,
  FetchableDataRecord<ColonyRolesMap>
>;
