import { $ReadOnly } from 'utility-types';

import BigNumber from 'bn.js';
import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

type Shared = {
  address: Address;
  balance?: BigNumber;
  isExternal?: boolean;
  isNative?: boolean;
  iconHash?: string;
};

export type TokenReferenceType = $ReadOnly<Shared>;

export type TokenReferenceRecordType = RecordOf<Shared>;

const defaultProps: Shared = {
  address: '',
  balance: undefined,
  isExternal: undefined,
  isNative: undefined,
  iconHash: undefined,
};

export const TokenReferenceRecord: Record.Factory<Shared> = Record(
  defaultProps,
);

export default TokenReferenceRecord;
