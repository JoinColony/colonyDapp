import BigNumber from 'bn.js';
import { Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

type Shared = {
  address: Address;
  balance?: BigNumber;
  iconHash?: string;
};

export type UserTokenReferenceType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  address: undefined,
  balance: undefined,
  iconHash: undefined,
};

export class UserTokenReferenceRecord extends Record<Shared>(defaultValues) {}

export const UserTokenReference = (p: Shared) =>
  new UserTokenReferenceRecord(p);
