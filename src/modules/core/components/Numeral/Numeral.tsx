import React from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import numbro from 'numbro';
import moveDecimal from 'move-decimal-point';
import classnames from 'classnames';

import { numbroCustomLanguage } from '~utils/numbers/numbroCustomLanguage';

import TinyNumber from './TinyNumber';
import EngineeringNotation from './EngineeringNotation';

import styles from './Numeral.css';

const smallNumberFormat: numbro.Format = {
  mantissa: 5,
  trimMantissa: true,
};

const mediumNumberFormat: numbro.Format = {
  mantissa: 2,
  trimMantissa: true,
  thousandSeparated: true,
};

const bigNumberFormat: numbro.Format = {
  totalLength: 6,
  trimMantissa: true,
  roundingFunction(num) {
    return num;
  },
};

interface PrefixSuffixOptions {
  prefix?: string;
  suffix?: string;
}

export const getValueWithPrefixAndSuffix = (
  value: string,
  { prefix, suffix }: PrefixSuffixOptions,
) => `${prefix ? `${prefix} ` : ''}${value}${suffix ? ` ${suffix}` : ''}`;

export interface Props {
  value: string | BigNumber | number;

  /** Specifies how many digits to move the decimal point by */
  decimals?: number;

  /** Specifies the unit passed to ether's formatUnits */
  unit?: string;

  prefix?: string;

  suffix?: string;

  className?: string;
}

const displayName = 'Numeral';

const Numeral = ({
  value,
  unit,
  decimals,
  prefix,
  suffix,
  className,
}: Props) => {
  // register numbro custom language (used for capitalised abbreviations)
  numbro.registerLanguage(numbroCustomLanguage);
  numbro.setLanguage('en-GB');

  let convertedValue = value.toString(10);

  if (unit) {
    convertedValue = formatUnits(value, unit);
  }

  if (decimals) {
    convertedValue = moveDecimal(value.toString(10), -decimals);
  }

  const classNames = classnames(styles.numeral, className);

  if (Number(convertedValue) === 0) {
    return (
      <span className={classNames}>
        {getValueWithPrefixAndSuffix('0', { prefix, suffix })}
      </span>
    );
  }

  if (Number(convertedValue) < 0.00001) {
    return (
      <TinyNumber
        value={convertedValue}
        prefix={prefix}
        suffix={suffix}
        className={classNames}
      />
    );
  }

  if (Number(convertedValue) >= 1_000_000_000_000) {
    return (
      <EngineeringNotation
        value={convertedValue}
        prefix={prefix}
        suffix={suffix}
        className={classNames}
      />
    );
  }

  let numberFormat: numbro.Format = {};
  if (Number(convertedValue) < 1000) {
    numberFormat = smallNumberFormat;
  } else if (Number(convertedValue) < 1_000_000) {
    numberFormat = mediumNumberFormat;
  } else if (Number(convertedValue) < 1_000_000_000_000) {
    numberFormat = bigNumberFormat;
  }

  const formattedNumber = numbro.validate(convertedValue, numberFormat)
    ? numbro(convertedValue).format(numberFormat)
    : value.toString();

  return (
    <span className={classNames}>
      {getValueWithPrefixAndSuffix(formattedNumber, { prefix, suffix })}
    </span>
  );
};

Numeral.displayName = displayName;
export default Numeral;
