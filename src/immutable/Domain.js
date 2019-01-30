/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  id: number,
  name: string,
|};

export type DomainType = $ReadOnly<Shared>;

export type DomainRecordType = RecordOf<Shared>;

export type DomainId = $PropertyType<DomainRecordType, 'id'>;

const defaultValues: $Shape<Shared> = {
  id: undefined,
  name: undefined,
};

const DomainRecord: RecordFactory<Shared> = Record(defaultValues);

export default DomainRecord;
