/* @flow */
import BN from 'bn.js';

type CommonProps = {|
  symbol: string,
|};

export type InProps = {|
  ...CommonProps,
  amount: BN | number,
|};

export type EnhancedProps = {|
  ...CommonProps,
  networkFee: number,
|};
