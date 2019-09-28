import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

interface Shared {
  record: any;
  error?: string | void;
  isFetching?: boolean;
  lastFetchedAt?: Date;
}

export type FetchableDataType<R> = Readonly<Shared> & { record: R };

const defaultValues: DefaultValues<Shared> = {
  record: undefined,
  error: undefined,
  isFetching: false,
  lastFetchedAt: new Date(0),
};

export class FetchableDataRecord<R> extends Record<Shared>(defaultValues) {
  get record() {
    return super.record as R;
  }

  toJS() {
    return super.toJS() as FetchableDataType<
      R extends { toJS: (...args: any) => any } ? ReturnType<R['toJS']> : R
    >;
  }
}

export const FetchableData = <R>(p?: Shared) => new FetchableDataRecord<R>(p);
