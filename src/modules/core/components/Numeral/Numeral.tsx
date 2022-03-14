import React, { HTMLAttributes, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers/utils';

import { getMainClasses } from '~utils/css';
import { numberDisplayFormatter } from '~utils/numbers';

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

  /** Prefix the value with this string */
  prefix?: string;

  /** Suffix the value with this string */
  suffix?: string;

  /** Number of mantissa digits to show */
  mantissa?: number;

  /** Total length of number to show */
  totalLength?: number;

  /** Number of decimals to format the number with, or unit from which to determine this (ether, gwei, etc.) */
  unit?: number | string;

  /** Actual value */
  value: string | BigNumber | number;
}

const Numeral = ({
  appearance,
  className,
  prefix,
  suffix,
  mantissa,
  totalLength,
  unit,
  value,
  ...props
}: Props) => {
  // formattedNumber could contain HTML,
  // use outputRef to reference as an html object
  const outputRef = useRef<HTMLSpanElement>(null);
  const formattedNumber = numberDisplayFormatter({
    unit,
    value,
    mantissa,
    totalLength,
  });

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.innerHTML = `${prefix ? `${prefix} ` : ''}
        ${formattedNumber}
        ${suffix ? ` ${suffix}` : ''}`;
    }
  }, [outputRef, formattedNumber, prefix, suffix]);

  return (
    <span
      className={className || getMainClasses(appearance, styles)}
      {...props}
      ref={outputRef}
    />
  );
};

export default Numeral;
