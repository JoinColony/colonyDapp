import numbro from 'numbro';
import moveDecimal from 'move-decimal-point';
import { BigNumber, formatUnits } from 'ethers/utils';

export interface FunctionArgs {
  /** Should use separator (e.g. for thousands ',') */
  useSeparator?: boolean;

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

  /** Abreviate value once over a million */
  abreviateOverMillion?: boolean;
}

export const stdNumberFormatter = ({
  unit,
  value,
  prefix,
  suffix,
  truncate,
  useSeparator = true,
  // reducedOutput = true,
  abreviateOverMillion = true,
}: FunctionArgs): string => {
  const defaultFormat = {
    trimMantissa: true,
    optionalMantissa: true,
    mantissa: truncate != null ? truncate : 5,
    spaceSeparated: false,
    thousandSeparated: useSeparator,
    average: false,
  };

  const aboveMillionFormat = {
    mantissa: 1,
    optionalMantissa: true,
    average: true,
    lowPrecision: true,
    totalLength: 2,
  };

  const convertedNum =
    typeof unit === 'string'
      ? formatUnits(value, unit || 0)
      : moveDecimal(value.toString(10), -(unit || 0));

  const formatType =
    abreviateOverMillion && convertedNum >= 1000000
      ? aboveMillionFormat
      : defaultFormat;

  if (!numbro.validate(convertedNum, formatType)) {
    return value.toString();
  }

  return `${prefix ? `${prefix} ` : ''}
    ${numbro(convertedNum).format(formatType)}
    ${suffix ? ` ${suffix}` : ''}`;
};
