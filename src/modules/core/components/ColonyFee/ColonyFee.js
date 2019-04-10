/* @flow */

import type { HOC } from 'recompose';

import { compose, mapProps } from 'recompose';
import BN from 'bn.js';

import type { InProps } from './types';

import ColonyFee from './ColonyFee.jsx';

const NETWORK_FEE = 0.01;

const enhance: HOC<*, InProps> = compose(
  mapProps(({ amount, symbol }: InProps) => ({
    networkFee: new BN(amount).toNumber() * NETWORK_FEE,
    symbol,
  })),
);

export default enhance(ColonyFee);
