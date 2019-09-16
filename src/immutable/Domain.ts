import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

interface Shared {
  id: number;
  name: string;
  // Empty if root, but we don't actually store root domain yet anyway
  parentId?: number;
}

export type DomainType = Readonly<Shared>;

export type DomainId = Shared['id'];

const defaultValues: DefaultValues<Shared> = {
  id: undefined,
  name: undefined,
  parentId: undefined,
};

export class DomainRecord extends Record<Shared>(defaultValues) {}

export const Domain = (p: Shared) => new DomainRecord(p);
