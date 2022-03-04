import React, { HTMLAttributes } from 'react';
import { BigNumber } from 'ethers/utils';

import { getMainClasses } from '~utils/css';
import { formatTokenValue } from '~utils/numbers';

import styles from './Numeral.css';

interface Appearance {
  theme: 'primary' | 'grey' | 'dark' | 'blue';
  size?: 'medium' | 'large' | 'small' | 'smallish';
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

  /** Should large number be truncate to 5 figures */
  reducedOutput?: boolean;
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
  reducedOutput = true,
  ...props
}: Props) => {
  const formattedNumber = formatTokenValue({
    unit,
    value,
    prefix,
    suffix,
    integerSeparator,
    truncate,
    reducedOutput,
  });

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
