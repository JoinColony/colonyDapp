import React, { HTMLAttributes } from 'react';
import formatNumber from 'format-number';
import moveDecimal from 'move-decimal-point';
import { BigNumber, formatUnits } from 'ethers/utils';

import { getMainClasses } from '~utils/css';

import styles from './Numeral.css';

interface Appearance {
  theme: 'primary' | 'grey' | 'dark' | 'blue';
  size?: 'medium' | 'large' | 'small';
  weight?: 'medium';
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
  value: number | string | BigNumber;
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
      ? formatUnits(value, unit)
      : moveDecimal(value.toString(10), -(unit || 0));

  const formattedNumber = formatNumber({
    prefix,
    suffix,
    integerSeparator,
    truncate,
  })(parseFloat(convertedNum));

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
