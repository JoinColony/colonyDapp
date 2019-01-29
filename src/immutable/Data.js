/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type DataProps<R: any> = {|
  record: ?R,
  error: ?string,
  isFetching: boolean,
|};

export type DataRecord<R: any> = RecordOf<DataProps<R>>;

const defaultValues: $Shape<DataProps<*>> = {
  record: undefined,
  error: undefined,
  isFetching: false,
};

const DataRecordFactory: RecordFactory<DataProps<*>> = Record(defaultValues);

const Data = <R: any>(props?: $Shape<DataProps<R>>): DataRecord<R> =>
  DataRecordFactory(props);

export default Data;
