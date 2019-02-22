/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';
import BigNumber from 'bn.js';

import type { Address } from '~types';

type Shared = {|
  address: Address,
  balance: BigNumber,
  icon?: string,
  isBlocked?: boolean,
  isEnabled?: boolean,
  isNative?: boolean,
  name: string,
  symbol: string,
|};

export type TokenType = $ReadOnly<Shared>;

export type TokenRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  address: undefined,
  balance: undefined,
  icon: undefined,
  isBlocked: undefined,
  isEnabled: undefined,
  isNative: undefined,
  name: undefined,
  symbol: undefined,
};

const TokenRecord: RecordFactory<Shared> = Record(defaultValues);

export default TokenRecord;
