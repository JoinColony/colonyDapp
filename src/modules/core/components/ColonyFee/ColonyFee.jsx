/* @flow */

import React from 'react';
import BN from 'bn.js';

import Numeral from '~core/Numeral';

import styles from './ColonyFee.css';

type Props = {|
  amount: BN | string,
  symbol: string,
|};

const displayName = 'ColonyFee';

const ColonyFee = ({ amount, symbol }: Props) => (
  <div className={styles.main}>
    <Numeral value={amount} suffix={` ${symbol}`} />
  </div>
);

ColonyFee.displayName = displayName;

export default ColonyFee;
