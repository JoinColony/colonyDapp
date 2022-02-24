import numbro from 'numbro';

import moveDecimal from 'move-decimal-point';

import { BigNumber, formatUnits } from 'ethers/utils';
import { SMALL_TOKEN_AMOUNT_FORMAT } from '~constants';

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

  /** Should provide output of SMALL_TOKEN_AMOUNT_FORMAT
   * when value is below 0.00001 */
  useSmallNumberDefault?: boolean;
}

export const numberFormatter = ({
  unit,
  value,
  prefix,
  suffix,
  truncate = 5,
  useSeparator = true,
  // reducedOutput = true,
  abreviateOverMillion = true,
  useSmallNumberDefault = true,
}: FunctionArgs): string => {
  numbro.registerLanguage({
    languageTag: 'en-GB',
    delimiters: {
      thousands: ',',
      decimal: '.',
    },
    abbreviations: {
      thousand: 'K',
      million: 'M',
      billion: 'B',
      trillion: 'T',
    },
    ordinal: (number) => {
      const b = number % 10;
      if (Math.round((number % 100) / 10) === 1) {
        return 'th';
      }
      if (b === 1) {
        return 'st';
      }
      if (b === 2) {
        return 'st';
      }
      if (b === 3) {
        return 'rd';
      }
      return 'th';
    },
    currency: {
      symbol: '',
      position: 'prefix',
      code: '',
    },
    currencyFormat: {
      thousandSeparated: true,
      totalLength: 4,
      spaceSeparated: false,
      spaceSeparatedCurrency: false,
      average: true,
    },
    formats: {
      fourDigits: {
        totalLength: 4,
        spaceSeparated: false,
        average: true,
      },
      fullWithTwoDecimals: {
        output: 'currency',
        thousandSeparated: true,
        spaceSeparated: false,
        mantissa: 2,
      },
      fullWithTwoDecimalsNoCurrency: {
        mantissa: 2,
        thousandSeparated: true,
      },
      fullWithNoDecimals: {
        output: 'currency',
        thousandSeparated: true,
        spaceSeparated: false,
        mantissa: 0,
      },
    },
  });

  numbro.setLanguage('en-GB');

  const defaultFormat = {
    // totalLength: reducedOutput ? 5 : 0,
    trimMantissa: true,
    optionalMantissa: true,
    mantissa: truncate,
    spaceSeparated: false,
    thousandSeparated: useSeparator,
    average: false,
  };

  const aboveMillionFormat = {
    mantissa: 5,
    trimMantissa: true,
    average: true,
    lowPrecision: true,
    totalLength: 6,
    spaceSeparated: false,
    thousandSeparated: useSeparator,
  };

  const convertedNum =
    typeof unit === 'string'
      ? formatUnits(value, unit || 0)
      : moveDecimal(value.toString(10), -(unit || 0));

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

  return `${prefix ? `${prefix} ` : ''}
    ${numbro(convertedNum).format(formatType)}
    ${suffix ? ` ${suffix}` : ''}`;
};
