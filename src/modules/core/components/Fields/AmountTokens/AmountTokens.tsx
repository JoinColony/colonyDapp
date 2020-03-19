import React, { useMemo } from 'react';
import { MessageDescriptor } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { AnyTokens } from '~data/index';
import { Address } from '~types/index';

import Select from '../Select';
import Input from '../Input';

import styles from './AmountTokens.css';

interface Props {
  label: MessageDescriptor | string;
  nameAmount: string;
  nameToken: string;
  tokens: AnyTokens;
  selectedTokenAddress: Address;
}

const displayName = 'Fields.AmountTokens';

const AmountTokens = ({
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
  const decimals =
    (selectedToken && selectedToken.decimals) || DEFAULT_TOKEN_DECIMALS;
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
        />
      </div>
      <div>
        <Select
          appearance={{ theme: 'grey', width: 'strict' }}
          elementOnly
          label={label}
          name={nameToken}
          options={tokenOptions}
        />
      </div>
    </div>
  );
};

AmountTokens.displayName = displayName;

export default AmountTokens;
