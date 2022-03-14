import numbro from 'numbro';
import moveDecimal from 'move-decimal-point';

import { BigNumber } from 'ethers/utils';

import { numbroCustomLanguage } from './numbroCustomLanguage';

export const SMALL_TOKEN_AMOUNT_FORMAT = '0.00000...';
export interface FunctionArgs {
  /** Should use separator (e.g. for thousands ',') */
  useSeparator?: boolean;

  /** Number of decimals to format the number with, or unit from which to determine this (ether, gwei, etc.) */
  unit?: number | string;

  /** Number of mantissa digits to show */
  mantissa?: number;

  /** Total length of number to show */
  totalLength?: number;

  /** Actual value */
  value: number | BigNumber | string;

  /** Abreviate value once over a million */
  abreviateOverMillion?: boolean;

  /** Should provide output of SMALL_TOKEN_AMOUNT_FORMAT
   * when value is below 0.00001 */
  useSmallNumberDefault?: boolean;
}

// handle very large numbers
const engineeringNotation = (n: number, format: {}) => {
  const decimals = Math.floor(Math.log10(n));
  const shift = decimals - (decimals % 3);
  // Note this toLocaleString loses precision.
  const formattedNum = moveDecimal(
    n.toLocaleString('fullwide', { useGrouping: false }),
    -shift,
  );
  return `${numbro(formattedNum).format(format)}×10<sup>${shift}</sup>`;
};

export const numberDisplayFormatter = ({
  unit,
  value,
  mantissa = 5,
  totalLength = 6,
  useSeparator = true,
  abreviateOverMillion = true,
  useSmallNumberDefault = true,
}: FunctionArgs): string => {
  numbro.registerLanguage(numbroCustomLanguage);
  numbro.setLanguage('en-GB');

  const defaultFormat = {
    trimMantissa: true,
    optionalMantissa: true,
    mantissa,
    spaceSeparated: false,
    thousandSeparated: useSeparator,
    average: false,
    totalLength,
  };

  const aboveMillionFormat = {
    trimMantissa: true,
    mantissa,
    totalLength,
    average: true,
    lowPrecision: true,
    spaceSeparated: false,
    thousandSeparated: useSeparator,
  };

  const convertedNum = moveDecimal(value.toString(10), -(unit || 0));

  // handle very small numbers
  if (useSmallNumberDefault && convertedNum < 0.00001 && convertedNum > 0) {
    return SMALL_TOKEN_AMOUNT_FORMAT;
  }

  const formatType =
    abreviateOverMillion && convertedNum >= 1000000
      ? aboveMillionFormat
      : defaultFormat;

  if (!numbro.validate(convertedNum, formatType)) {
    return value.toString();
  }

  return abreviateOverMillion && convertedNum >= 1000000000000000
    ? engineeringNotation(Number(convertedNum), formatType)
    : numbro(convertedNum).format(formatType);
};

export const minimalFormatter = ({ unit, value }: FunctionArgs): string => {
  numbro.registerLanguage(numbroCustomLanguage);
  numbro.setLanguage('en-GB');

  const minimalFormat = {
    mantissa: 5,
    optionalMantissa: true,
    spaceSeparated: false,
    thousandSeparated: false,
    average: false,
  };

  const convertedNum = moveDecimal(value.toString(10), -(unit || 0));

  if (!numbro.validate(convertedNum, minimalFormat)) {
    return value.toString();
  }
  return numbro(convertedNum).format(minimalFormat);
};
