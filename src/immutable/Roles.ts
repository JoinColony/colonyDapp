import { $ReadOnly } from 'utility-types';

import { RecordOf, Record, Set as ImmutableSet } from 'immutable';

import { Address } from '~types/index';

interface Shared {
  founder: Address;
}

export type RolesType = $ReadOnly<Shared> & {
  admins: Address[];
};

type ImmutableType = Shared & {
  admins: ImmutableSet<Address>;
};

export type RolesRecordType = RecordOf<ImmutableType>;

const defaultValues: ImmutableType = {
  admins: ImmutableSet(),
  founder: undefined,
};

export const RolesRecord: Record.Factory<ImmutableType> = Record(defaultValues);

export default RolesRecord;
