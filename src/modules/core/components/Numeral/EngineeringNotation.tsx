import React from 'react';
import moveDecimal from 'move-decimal-point';
import numbro from 'numbro';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';

interface Props {
  value: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const displayName = 'Numeral.EngineeringNotation';

const EngineeringNotation = ({ value, prefix, suffix, className }: Props) => {
  const format: numbro.Format = {
    totalLength: 6,
    trimMantissa: true,
    exponential: false,
  };

  const decimals = Math.floor(Math.log10(Number(value)));
  // positive exponents (for numbers >= 1 trillion) should be a multiply of 3
  const power = decimals < 0 ? decimals : decimals - (decimals % 3);
  const coefficient = moveDecimal(
    // this is to avoid JS exponential notation for small numbers, eg. "1e-8"
    Number(value).toFixed(DEFAULT_TOKEN_DECIMALS),
    -power,
  );

  return (
    <span className={className}>
      {prefix && `${prefix} `}
      {numbro(coefficient).format(format)}x10<sup>{power}</sup>
      {suffix && ` ${suffix}`}
    </span>
  );
};

EngineeringNotation.displayName = displayName;
export default EngineeringNotation;
