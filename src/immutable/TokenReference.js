/* @flow */

import type BigNumber from 'bn.js';
import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '../types';

type Shared = {|
  address: Address,
  balance?: BigNumber,
  isNative?: boolean,
  icon?: string,
|};

export type TokenReferenceType = $ReadOnly<Shared>;

export type TokenReferenceRecordType = RecordOf<Shared>;

const defaultProps: $Shape<Shared> = {
  address: undefined,
  balance: undefined,
  isNative: undefined,
  icon: undefined,
};

const TokenReferenceRecord: RecordFactory<Shared> = Record(defaultProps);

export default TokenReferenceRecord;
