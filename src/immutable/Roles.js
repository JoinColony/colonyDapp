/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, Set as ImmutableSet } from 'immutable';

import type { Address } from '~types';

type Shared = {|
  founder: Address,
|};

export type RolesType = {|
  ...$ReadOnly<Shared>,
  admins: Address[],
|};

type ImmutableType = {|
  ...Shared,
  admins: ImmutableSet<Address>,
|};

export type RolesRecordType = RecordOf<ImmutableType>;

const defaultValues: $Shape<ImmutableType> = {
  admins: new ImmutableSet(),
  founder: undefined,
};

const RolesRecord: RecordFactory<ImmutableType> = Record(defaultValues);

export default RolesRecord;
