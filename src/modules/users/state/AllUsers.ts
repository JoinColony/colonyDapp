import { Map as ImmutableMap, Record, Set as ImmutableSet } from 'immutable';

import { Address } from '~types/index';
import {
  UserRecord,
  FetchableDataRecord,
  FetchableDataType,
  UserType,
} from '~immutable/index';

import { USERS_USERS, USERS_COLONIES } from '../constants';

export type UserColonies = ImmutableSet<Address> & { toJS(): Address[] };

export type ColoniesMap = ImmutableMap<
  Address,
  FetchableDataRecord<UserColonies>
> & { toJS(): { [userAddress: string]: FetchableDataType<Address[]> } };

export type UsersMap = ImmutableMap<
  Address,
  FetchableDataRecord<UserRecord>
> & { toJS(): { [userAddress: string]: FetchableDataType<UserType> } };

export interface AllUsersProps {
  [USERS_COLONIES]: ColoniesMap;
  [USERS_USERS]: UsersMap;
}

export class AllUsersRecord extends Record<AllUsersProps>({
  [USERS_COLONIES]: ImmutableMap() as ColoniesMap,
  [USERS_USERS]: ImmutableMap() as UsersMap,
}) {}
