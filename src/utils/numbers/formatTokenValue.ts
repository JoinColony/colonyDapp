import formatNumber from 'format-number';
import moveDecimal from 'move-decimal-point';
import { BigNumber, formatUnits } from 'ethers/utils';

export interface FunctionArgs {
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

export const formatTokenValue = ({
  unit,
  value,
  prefix,
  suffix,
  integerSeparator,
  truncate,
  reducedOutput = true,
}: FunctionArgs) => {
  const convertedNum =
    typeof unit === 'string'
      ? formatUnits(value, unit)
      : moveDecimal(value.toString(10), -(unit || 0));

  const largeNumberTruncate = convertedNum > 10 ** 4 ? 0 : truncate;

  return formatNumber({
    prefix,
    suffix,
    integerSeparator,
    truncate: reducedOutput ? largeNumberTruncate : truncate,
  })(parseFloat(convertedNum));
};
