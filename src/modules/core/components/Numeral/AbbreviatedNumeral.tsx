import React, { HTMLAttributes } from 'react';
import BN from 'bn.js';
import { fromWei } from 'ethjs-unit';
import { UnifiedNumberFormatOptions } from '@formatjs/intl-unified-numberformat';
import moveDecimal from 'move-decimal-point';
import { useIntl } from 'react-intl';
import { Unit } from 'web3-utils';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /** When dealing with ethereum units */
  ethUnit?: Unit;
  /** Disallow children */
  children?: never;
  /** Format options for `intl-unified-numberformat` */
  formatOptions: UnifiedNumberFormatOptions;
  /** Actual value */
  value: number | string | BN;
}

const displayName = 'AbbreviatedNumeral';

/**
 *
 * @todo Combine `AbbreviatedNumeral` & `Numeral` into 1 component (`Numeral`)
 * @body `AbbreviatedNumeral` doesn't support prefix, suffix, etc., but DOES support `i18n`, which `Numeral` does not support. Ideally, we'd have both.
 *
 */

/**
 * For use in cases where precision isn't necessary.
 * Convers long numbers into abbreviated format.
 *
 * i.e.:
 *     10,000 => 10k
 *     1,000,000 => 1m
 */
const AbbreviatedNumeral = ({
  formatOptions = {},
  value,
  ethUnit,
  ...rest
}: Props) => {
  const { locale } = useIntl();
  const convertedNum =
    typeof ethUnit === 'string'
      ? fromWei(value.toString(10), ethUnit)
      : moveDecimal(value.toString(10), -(ethUnit || 0));

  const formattedNumber = new Intl.NumberFormat(locale, formatOptions).format(
    convertedNum,
  );

  return <span {...rest}>{formattedNumber}</span>;
};

AbbreviatedNumeral.displayName = displayName;

export default AbbreviatedNumeral;
