/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

export type DomainProps = {
  id: number,
  name: string,
  tasksDatabase: string,
};

export type DomainRecord = RecordOf<DomainProps>;

const defaultValues: $Shape<DomainProps> = {
  id: undefined,
  name: undefined,
  tasksDatabase: undefined,
};

const Domain: RecordFactory<DomainProps> = Record(defaultValues);

export default Domain;
