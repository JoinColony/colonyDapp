/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

type Shared = {|
  address: Address,
  didClaimPayout: boolean,
  didFailToRate: boolean,
  didRate: boolean,
  rating?: number,
|};

export type TaskUserType = $ReadOnly<Shared>;

export type TaskUserRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  address: undefined,
  didClaimPayout: false,
  didFailToRate: false,
  didRate: false,
  rating: undefined,
};

const TaskUserRecord: RecordFactory<Shared> = Record(defaultValues);

export default TaskUserRecord;
