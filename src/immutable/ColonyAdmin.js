/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  state: 'pending' | 'confirmed',
  address: string,
|};

export type ColonyAdminType = $ReadOnly<Shared>;

export type ColonyAdminRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  state: 'pending',
  address: undefined,
};

const ColonyAdminRecord: RecordFactory<Shared> = Record(defaultProps);

export default ColonyAdminRecord;
