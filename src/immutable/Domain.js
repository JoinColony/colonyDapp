/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

export type DomainProps = {
  id: number,
  name: string,
};

export type DomainRecord = RecordOf<DomainProps>;

export type DomainId = $PropertyType<DomainRecord, 'id'>;

const defaultValues: $Shape<DomainProps> = {
  id: undefined,
  name: undefined,
};

const Domain: RecordFactory<DomainProps> = Record(defaultValues);

export default Domain;
