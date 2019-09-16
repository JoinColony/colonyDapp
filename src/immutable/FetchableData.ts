import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

interface Shared<R> {
  record: R;
  error?: string | void;
  isFetching?: boolean;
  lastFetchedAt?: Date;
}

export type FetchableDataType<R> = Readonly<Shared<R>>;

const defaultValues: DefaultValues<Shared<any>> = {
  record: undefined,
  error: undefined,
  isFetching: false,
  lastFetchedAt: new Date(0),
};

export class FetchableDataRecord<R> extends Record<Shared<any>>(
  defaultValues,
) {}

export const FetchableData = <R>(p?: Shared<R>) =>
  new FetchableDataRecord<R>(p);
