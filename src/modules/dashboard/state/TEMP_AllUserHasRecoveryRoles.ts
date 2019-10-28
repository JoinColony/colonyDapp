import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { Address } from '~types/index';

import { FetchableDataType, FetchableDataRecord } from '~immutable/index';

export type RecoveryRolesUsers = ImmutableSet<Address>;

export type TEMP_AllUserHasRecoveryRoles = ImmutableMap<
  Address,
  FetchableDataRecord<RecoveryRolesUsers>
> & {
  toJS(): Record<Address, FetchableDataType<Address[]>>;
};
