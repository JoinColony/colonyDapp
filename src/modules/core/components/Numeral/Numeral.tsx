import React, { HTMLAttributes } from 'react';
import BN from 'bn.js';
import formatNumber from 'format-number';
import { fromWei } from 'ethjs-unit';
import moveDecimal from 'move-decimal-point';

import { getMainClasses } from '~utils/css';

import styles from './Numeral.css';

interface Appearance {
  theme: 'primary' | 'grey' | 'dark';
  size: 'medium' | 'large' | 'small';
}

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** Appearance object */
  appearance?: Appearance;

  /** Optional custom className, will overwrite appearance */
  className?: string;

  /** Separator for thousands (e.g. ',') */
  integerSeparator?: string;

  /** Prefix the value with this string */
  prefix?: string;

  /** Suffix the value with this string */
  suffix?: string;

  /** Number of decimals to show after comma */
  truncate?: number;

  /** Number of decimals to format the number with, or unit from which to determine this (ether, gwei, etc.) */
  unit?: number | string;

  /** Actual value */
  value: number | string | BN;
}

const Numeral = ({
  appearance,
  className,
  integerSeparator = ',',
  prefix,
  suffix,
  truncate,
  unit,
  value,
  ...props
}: Props) => {
  const convertedNum =
    typeof unit === 'string'
      ? fromWei(value.toString(10), unit)
      : moveDecimal(value.toString(10), -(unit || 0));

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
