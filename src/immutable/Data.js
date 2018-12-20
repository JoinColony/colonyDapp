/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type DataProps<R: *> = {|
  record: ?R,
  error: ?string,
  isFetching: boolean,
|};

export type DataRecord<R: *> = RecordOf<DataProps<R>>;

const defaultValues: $Shape<DataProps<*>> = {
  record: undefined,
  error: undefined,
  isFetching: false,
};

const DataRecordFactory: RecordFactory<DataProps<*>> = Record(defaultValues);

const Data = <R: *>(props?: $Shape<DataProps<*>>): DataRecord<R> =>
  DataRecordFactory(props);

export default Data;
