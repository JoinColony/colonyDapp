import React, { useMemo } from 'react';
import { MessageDescriptor } from 'react-intl';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { AnyTokens } from '~data/index';
import { Address } from '~types/index';

import Select from '../Select';
import Input from '../Input';

import styles from './AmountTokens.css';

interface Props {
  id?: string;
  label: MessageDescriptor | string;
  nameAmount: string;
  nameToken: string;
  tokens: AnyTokens;
  selectedTokenAddress: Address;
}

const displayName = 'Fields.AmountTokens';

const AmountTokens = ({
  id,
  label,
  nameAmount,
  nameToken,
  selectedTokenAddress,
  tokens,
}: Props) => {
  const tokenOptions = useMemo(
    () =>
      tokens.map(({ address, symbol }) => ({
        label: symbol,
        value: address,
      })),
    [tokens],
  );

  const selectedToken = useMemo(
    () => tokens.find(({ address }) => address === selectedTokenAddress),
    [selectedTokenAddress, tokens],
  );
  const decimals = getTokenDecimalsWithFallback(
    selectedToken && selectedToken.decimals,
  );
  return (
    <div className={styles.main}>
      <div className={styles.inputContainer}>
        <Input
          appearance={{ size: 'medium', theme: 'underlined' }}
          formattingOptions={{
            delimiter: ',',
            numeral: true,
            numeralDecimalScale: decimals,
          }}
          label={label}
          name={nameAmount}
          id={`${id}-amount`}
        />
      </div>
      <div>
        <Select
          appearance={{ theme: 'grey', width: 'strict' }}
          elementOnly
          label={label}
          name={nameToken}
          options={tokenOptions}
          id={`${id}-token`}
        />
      </div>
    </div>
  );
};

AmountTokens.displayName = displayName;

export default AmountTokens;
