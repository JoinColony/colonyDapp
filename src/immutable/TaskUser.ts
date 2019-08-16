import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

type Shared = {
  address: Address;
  didClaimPayout: boolean;
  didFailToRate: boolean;
  didRate: boolean;
  rating?: number;
};

export type TaskUserType = $ReadOnly<Shared>;

export type TaskUserRecordType = RecordOf<Shared>;

const defaultValues: Shared = {
  address: undefined,
  didClaimPayout: false,
  didFailToRate: false,
  didRate: false,
  rating: undefined,
};

export const TaskUserRecord: Record.Factory<Shared> = Record(defaultValues);

export default TaskUserRecord;
