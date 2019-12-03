import { Map as ImmutableMap, Record, Set as ImmutableSet } from 'immutable';

import { Address } from '~types/index';
import { FetchableDataRecord, FetchableDataType } from '~immutable/index';

import { USERS_COLONIES } from '../constants';

export type UserColonies = ImmutableSet<Address> & { toJS(): Address[] };

export type ColoniesMap = ImmutableMap<
  Address,
  FetchableDataRecord<UserColonies>
> & { toJS(): { [userAddress: string]: FetchableDataType<Address[]> } };

export interface AllUsersProps {
  [USERS_COLONIES]: ColoniesMap;
}

export class AllUsersRecord extends Record<AllUsersProps>({
  [USERS_COLONIES]: ImmutableMap() as ColoniesMap,
}) {}
