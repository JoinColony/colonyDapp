/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

export type DomainProps = {
  id: number,
  name: string,
  tasksDatabase: string,
};

export type DomainRecord = RecordOf<DomainProps>;

const defaultValues: DomainProps = {
  id: 0,
  name: '',
  tasksDatabase: '',
};

const Domain: RecordFactory<DomainProps> = Record(defaultValues);

export default Domain;
