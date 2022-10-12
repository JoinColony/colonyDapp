import React from 'react';
import moveDecimal from 'move-decimal-point';
import numbro from 'numbro';

interface Props {
  value: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const EngineeringNotation = ({ value, prefix, suffix, className }: Props) => {
  const format: numbro.Format = { totalLength: 6, trimMantissa: true };

  const decimals = Math.floor(Math.log10(Number(value)));
  const power = decimals - (decimals % 3);

  const coefficient = moveDecimal(value, -power);

  return (
    <span className={className}>
      {prefix && `${prefix} `}
      {numbro(coefficient).format(format)}x10<sup>{power}</sup>
      {suffix && ` ${suffix}`}
    </span>
  );
};

export default EngineeringNotation;
