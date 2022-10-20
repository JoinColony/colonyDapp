import React from 'react';

import { Tooltip } from '~core/Popover';
import { getValueWithPrefixAndSuffix } from './Numeral';

const TINY_NUMBER_PLACEHOLDER = '0.00000...';

interface Props {
  value: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const displayName = 'Numeral.TinyNumber';

const TinyNumber = ({ value, prefix, suffix, className }: Props) => {
  return (
    <Tooltip content={getValueWithPrefixAndSuffix(value, { prefix, suffix })}>
      <span className={className}>
        {getValueWithPrefixAndSuffix(TINY_NUMBER_PLACEHOLDER, {
          prefix,
          suffix,
        })}
      </span>
    </Tooltip>
  );
};

TinyNumber.displayName = displayName;
export default TinyNumber;
