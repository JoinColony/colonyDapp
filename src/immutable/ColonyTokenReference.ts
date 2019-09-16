import BigNumber from 'bn.js';
import { Map as ImmutableMap, Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

type Shared = {
  address: Address;
  balances?: {
    [domainId: number]: BigNumber;
  };
  isExternal?: boolean;
  isNative?: boolean;
  iconHash?: string;
};

export type ColonyTokenReferenceType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  address: undefined,
  balances: ImmutableMap(),
  isExternal: undefined,
  isNative: undefined,
  iconHash: undefined,
};

export class ColonyTokenReferenceRecord extends Record<Shared>(defaultValues) {}

export const ColonyTokenReference = (p: Shared) =>
  new ColonyTokenReferenceRecord(p);
