/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  id: number,
  name: string,
  // Empty if root, but we don't actually store root domain yet anyway
  parentId?: number,
|};

export type DomainType = $ReadOnly<Shared>;

export type DomainRecordType = RecordOf<Shared>;

export type DomainId = $PropertyType<DomainRecordType, 'id'>;

const defaultValues: $Shape<Shared> = {
  id: undefined,
  name: undefined,
  parentId: undefined,
};

const DomainRecord: RecordFactory<Shared> = Record(defaultValues);

export default DomainRecord;
