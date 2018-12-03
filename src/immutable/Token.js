/* @flow */

import type { RecordOf } from 'immutable';

import { Record } from 'immutable';

// eslint-disable-next-line no-unused-vars
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
  id: number;
  isBlocked: boolean;
  isEnabled: boolean;
  isNative: boolean;
  name: string;
  symbol: string;
  */
  /* eslint-enable */

  get isEth() {
    // TODO: This could also read from the address (0x0). What if
    // some dastardly rapscallion names their ERC20 token 'ETH'?
    return this.symbol.toLowerCase() === 'eth';
  }
}

const Token = (props?: *): RecordOf<TokenProps> & TokenClass =>
  new TokenClass({ ...defaultValues, ...props });

export default Token;
