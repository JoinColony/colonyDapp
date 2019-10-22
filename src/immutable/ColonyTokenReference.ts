import BigNumber from 'bn.js';
import { Map as ImmutableMap, Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

interface Shared {
  address: Address;
  isExternal?: boolean;
  isNative?: boolean;
  iconHash?: string;
}

interface ColonyTokenReferenceBalancesObject {
  [domainId: string]: BigNumber;
}

type ColonyTokenReferenceBalancesMap = ImmutableMap<string, BigNumber> & {
  toJS(): ColonyTokenReferenceBalancesObject;
};

export interface ColonyTokenReferenceType extends Readonly<Shared> {
  balances?: ColonyTokenReferenceBalancesObject;
}

interface ColonyTokenReferenceProps extends Shared {
  balances?: ColonyTokenReferenceBalancesMap;
}

const defaultValues: DefaultValues<ColonyTokenReferenceProps> = {
  address: undefined,
  balances: ImmutableMap() as ColonyTokenReferenceBalancesMap,
  isExternal: undefined,
  isNative: undefined,
  iconHash: undefined,
};

export class ColonyTokenReferenceRecord
  extends Record<ColonyTokenReferenceProps>(defaultValues)
  implements RecordToJS<ColonyTokenReferenceType> {}

export const ColonyTokenReference = (p: ColonyTokenReferenceProps) =>
  new ColonyTokenReferenceRecord(p);
