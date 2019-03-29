/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, Set as ImmutableSet } from 'immutable';

type Shared = {|
  founder: string,
|};

export type RolesType = {|
  ...$ReadOnly<Shared>,
  admins: string[],
|};

type ImmutableType = {|
  ...Shared,
  admins: ImmutableSet<string>,
|};

export type RolesRecordType = RecordOf<ImmutableType>;

const defaultValues: $Shape<ImmutableType> = {
  admins: new ImmutableSet(),
  founder: undefined,
};

const RolesRecord: RecordFactory<ImmutableType> = Record(defaultValues);

export default RolesRecord;
