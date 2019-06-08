/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { Address } from '~types';

/**
 * @todo Fix Token record required props
 * @body `decimals` should be a required BigBumber, `name` and `symbol` should be optional.
 */
type Shared = {|
  address: Address,
  decimals?: number,
  isVerified?: boolean,
  name: string,
  symbol: string,
|};

export type TokenType = $ReadOnly<Shared>;

export type TokenRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  address: undefined,
  decimals: undefined,
  isVerified: false,
  name: undefined,
  symbol: undefined,
};

const TokenRecord: RecordFactory<Shared> = Record(defaultValues);

export default TokenRecord;
