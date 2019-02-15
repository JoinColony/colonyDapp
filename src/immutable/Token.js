/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';
import BigNumber from 'bn.js';

import type { Address } from '~types';

type Shared = {|
  address: Address,
  // TODO: balance shouldn't be part of this record
  balance?: BigNumber,
  decimals?: number,
  icon?: string,
  isBlocked?: boolean,
  isEnabled?: boolean,
  // TODO: should be `nativeFor: ColonyIdentifier`
  isNative?: boolean,
  isEth?: boolean,
  name: string,
  symbol: string,
|};

export type TokenType = $ReadOnly<Shared>;

export type TokenRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  address: undefined,
  balance: undefined,
  decimals: undefined,
  icon: undefined,
  isBlocked: undefined,
  isEnabled: undefined,
  isNative: undefined,
  isEth: undefined,
  name: undefined,
  symbol: undefined,
};

const TokenRecord: RecordFactory<Shared> = Record(defaultValues);

export default TokenRecord;
