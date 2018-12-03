/* @flow */

import type { RecordOf } from 'immutable';

import { Record } from 'immutable';

import type { Address, TokenProps } from '~types';

const defaultValues: TokenProps = {
  address: '',
  balance: 0,
  icon: '',
  id: 0,
  isBlocked: undefined,
  isEnabled: undefined,
  isNative: undefined,
  name: '',
  symbol: '',
  isEth: undefined,
};

class TokenClass extends Record(defaultValues)<TokenProps> {
  // TODO ideally this class could implement an interface
  // rather than repeat these types from `TokenProps`.
  address: Address;

  balance: number;

  icon: string;

  id: number;

  isBlocked: boolean;

  isEnabled: boolean;

  isNative: boolean;

  name: string;

  symbol: string;

  get isEth() {
    // TODO: This could also read from the address (0x0). What if
    // some dastardly rapscallion names their ERC20 token 'ETH'?
    return this.symbol.toLowerCase() === 'eth';
  }
}

const Token = (props?: Object): RecordOf<TokenProps> =>
  new TokenClass({ ...defaultValues, ...props });

export default Token;
