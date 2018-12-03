/* @flow */

import type { RecordOf } from 'immutable';

import type { Address } from '~types';

export type TokenProps = {
  address: Address,
  balance: number,
  icon: string,
  id: number,
  isBlocked?: boolean,
  isEnabled?: boolean,
  isEth?: boolean,
  isNative?: boolean,
  name: string,
  symbol: string,
};

export type TokenRecord = RecordOf<TokenProps>;
