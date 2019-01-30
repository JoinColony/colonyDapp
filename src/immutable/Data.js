/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

type Shared<R: any> = {|
  record: ?R,
  error: ?string,
  isFetching: boolean,
|};

export type DataType<R: any> = $ReadOnly<Shared<R>>;

export type DataRecordType<R: any> = RecordOf<Shared<R>>;

const defaultValues: $Shape<Shared<*>> = {
  record: undefined,
  error: undefined,
  isFetching: false,
};

const DataRecordFactory: RecordFactory<Shared<*>> = Record(defaultValues);

const DataRecord = <R: any>(props?: $Shape<Shared<R>>): DataRecordType<R> =>
  DataRecordFactory(props);

export default DataRecord;
