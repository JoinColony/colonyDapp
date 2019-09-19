import { Map as ImmutableMap, Record, Set as ImmutableSet } from 'immutable';

import { Address } from '~types/index';
import { UserRecord, FetchableDataRecord } from '~immutable/index';

import { USERS_USERS, USERS_COLONIES } from '../constants';

export type ColoniesMap = ImmutableMap<
  Address,
  FetchableDataRecord<ImmutableSet<Address>>
>;

export type UsersMap = ImmutableMap<Address, FetchableDataRecord<UserRecord>>;

export interface AllUsersProps {
  [USERS_COLONIES]: ColoniesMap;
  [USERS_USERS]: UsersMap;
}

export class AllUsersRecord extends Record<AllUsersProps>({
  [USERS_COLONIES]: ImmutableMap(),
  [USERS_USERS]: ImmutableMap(),
}) {}
