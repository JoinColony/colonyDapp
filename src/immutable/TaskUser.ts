import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

interface Shared {
  address: Address;
  didClaimPayout: boolean;
  didFailToRate: boolean;
  didRate: boolean;
  rating?: number;
}

export type TaskUserType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  address: undefined,
  didClaimPayout: false,
  didFailToRate: false,
  didRate: false,
  rating: undefined,
};

export class TaskUserRecord extends Record<Shared>(defaultValues)
  implements RecordToJS<TaskUserType> {}

export const TaskUser = (p: Shared) => new TaskUserRecord(p);
