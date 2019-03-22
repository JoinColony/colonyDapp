/* @flow */

import React from 'react';
import BN from 'bn.js';
import formatNumber from 'format-number';
import { fromWei } from 'ethjs-unit';

import { getMainClasses } from '~utils/css';

import styles from './Numeral.css';

type Appearance = {
  theme: 'primary' | 'grey' | 'dark',
  size: 'medium' | 'large' | 'small',
};

type Props = {|
  /** Appearance object */
  appearance?: Appearance,
  /** Optional custom className, will overwrite appearance */
  className?: string,
  /** Number of decimals to show after comma */
  decimals?: number,
  /** Prefix the value with this string */
  prefix?: string,
  /** Suffix the value with this string */
  suffix?: string,
  /** Ether unit the number is notated in (e.g. 'ether' = 10^18 wei) */
  unit?: string,
  /** Actual value */
  value: number | string | BN,
  /** Separator for thousands (e.g. ',') */
  integerSeparator?: string,
|};

const Numeral = ({
  appearance,
  className,
  decimals: truncate,
  integerSeparator = ',',
  prefix,
  suffix,
  unit,
  value,
  ...props
}: Props) => {
  let convertedNum;
  if (BN.isBN(value)) {
    convertedNum = unit ? fromWei(value, unit) : value.toString();
  } else {
    convertedNum = unit ? fromWei(value.toString(), unit) : value;
  }

  const formattedNumber = formatNumber({
    prefix,
    suffix,
    integerSeparator,
    truncate,
  })(convertedNum);

  return (
    <span
      className={className || getMainClasses(appearance, styles)}
      {...props}
    >
      {formattedNumber}
    </span>
  );
};

export default Numeral;
