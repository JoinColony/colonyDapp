import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

type Shared = {
  state: 'pending' | 'confirmed';
  address: Address;
};

export type ColonyAdminType = $ReadOnly<Shared>;

export type ColonyAdminRecordType = RecordOf<Shared>;

const defaultProps: Shared = {
  state: 'pending',
  address: undefined,
};

export const ColonyAdminRecord: Record.Factory<Shared> = Record(defaultProps);

export default ColonyAdminRecord;
