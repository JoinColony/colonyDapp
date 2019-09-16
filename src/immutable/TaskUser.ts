import { Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

type Shared = {
  address: Address;
  didClaimPayout: boolean;
  didFailToRate: boolean;
  didRate: boolean;
  rating?: number;
};

export type TaskUserType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  address: undefined,
  didClaimPayout: false,
  didFailToRate: false,
  didRate: false,
  rating: undefined,
};

export class TaskUserRecord extends Record<Shared>(defaultValues) {}

export const TaskUser = (p: Shared) => new TaskUserRecord(p);
