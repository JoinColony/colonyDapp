/* @flow */

import { Record } from 'immutable';

import type { Address } from '~types';

export type TokenProps = {
  address: Address,
  balance: number,
  icon: string,
  isBlocked?: boolean,
  isEnabled?: boolean,
  isNative?: boolean,
  name: string,
  symbol: string,
};

const defaultValues: TokenProps = {
  address: '',
  balance: 0,
  icon: '',
  isBlocked: false,
  isEnabled: false,
  isNative: false,
  name: '',
  symbol: '',
};

class TokenClass extends Record(defaultValues)<TokenProps> {
  // XXX This section repeats the flow types of `TokenProps` as properties
  // of the class, without interfering with the property accessors.
  // This is necessary because the `Record` flow type doesn't quite do
  // the trick when we extend it, and would otherwise complain about
  // missing properties.
  //
  /* eslint-disable */
  /*::
  address: Address;
  balance: number;
  icon: string;
  isBlocked: boolean;
  isEnabled: boolean;
  isNative: boolean;
  name: string;
  symbol: string;
  */
  /* eslint-enable */

  get isPositive() {
    return this.balance >= 0;
  }

  get isNotPositive() {
    return this.balance <= 0;
  }

  get isEth() {
    return this.address === '0x0';
  }
}

export type TokenRecord = TokenClass;

const Token = (props?: TokenProps) => new TokenClass(props);

export default Token;
