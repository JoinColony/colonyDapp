import BigNumber from 'bn.js';
import { Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

type Shared = {
  address: Address;
  balance?: BigNumber;
  isExternal?: boolean;
  isNative?: boolean;
  iconHash?: string;
};

export type TokenReferenceType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  address: undefined,
  balance: undefined,
  isExternal: undefined,
  isNative: undefined,
  iconHash: undefined,
};

export class TokenReferenceRecord extends Record<Shared>(defaultValues) {}

export const TokenReference = (p: Shared) => new TokenReferenceRecord(p);
