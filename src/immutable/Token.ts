import { Record } from 'immutable';

import { Address, DefaultValues, RecordToJS } from '~types/index';

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

export type TokenType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  address: undefined,
  decimals: undefined,
  isVerified: false,
  name: undefined,
  symbol: undefined,
};

export class TokenRecord extends Record<Shared>(defaultValues)
  implements RecordToJS<TokenType> {}

export const Token = (p: Shared) => new TokenRecord(p);
