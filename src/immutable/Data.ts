import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

interface Shared<R> {
  record: R;
  error: string | void;
  isFetching: boolean;
  lastFetchedAt: Date;
}

export type DataType<R> = $ReadOnly<Shared<R>>;

export type DataRecordType<R> = RecordOf<Shared<R>>;

const defaultValues: Shared<any> = {
  record: undefined,
  error: undefined,
  isFetching: false,
  lastFetchedAt: new Date(0),
};

export const DataRecordFactory: Record.Factory<Shared<any>> = Record(
  defaultValues,
);

export const DataRecord = <R>(props?: Partial<Shared<R>>): DataRecordType<R> =>
  DataRecordFactory(props);

export default DataRecord;
