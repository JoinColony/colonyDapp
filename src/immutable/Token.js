/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

type Shared = {|
  address: Address,
  // TODO: this should be required
  // TODO: this should be BN
  decimals?: number,
  // TODO: this should be optional
  name: string,
  // TODO: this should be optional
  symbol: string,
|};

export type TokenType = $ReadOnly<Shared>;

export type TokenRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  address: undefined,
  decimals: undefined,
  name: undefined,
  symbol: undefined,
};

const TokenRecord: RecordFactory<Shared> = Record(defaultValues);

export default TokenRecord;
