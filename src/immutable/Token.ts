import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

/**
 * @todo Fix Token record required props
 * @body `decimals` should be a required BigBumber, `name` and `symbol` should be optional.
 */
interface Shared {
  address: Address;
  decimals?: number;
  isVerified?: boolean;
  name: string;
  symbol: string;
}

export type TokenType = $ReadOnly<Shared>;

export type TokenRecordType = RecordOf<Shared>;

const defaultValues: Shared = {
  address: undefined,
  decimals: undefined,
  isVerified: false,
  name: undefined,
  symbol: undefined,
};

export const TokenRecord: Record.Factory<Shared> = Record(defaultValues);

export default TokenRecord;
