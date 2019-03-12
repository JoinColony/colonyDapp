/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

type Shared<R> = {|
  record: ?R,
  error: ?string,
  isFetching: boolean,
  lastFetchedAt: Date,
|};

export type DataType<R> = $ReadOnly<Shared<R>>;

export type DataRecordType<R> = RecordOf<Shared<R>>;

const defaultValues: $Shape<Shared<*>> = {
  record: undefined,
  error: undefined,
  isFetching: false,
  lastFetchedAt: new Date(0),
};

const DataRecordFactory: RecordFactory<Shared<*>> = Record(defaultValues);

const DataRecord = <R: any>(props?: $Shape<Shared<R>>): DataRecordType<R> =>
  DataRecordFactory(props);

export default DataRecord;
