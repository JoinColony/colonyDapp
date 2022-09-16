import React, { useMemo } from 'react';

import { AnyToken } from '~data/index';

import Select from '~core/Fields/Select';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { SafeToken } from '~dashboard/Dialogs/ControlSafeDialog/AmountBalances';

import { Props as SelectProps } from '../Select/types';

import styles from './TokenSymbolSelector.css';

interface Props extends Omit<SelectProps, 'options'> {
  tokens: AnyToken[] | SafeToken[];
}

const displayName = 'TokenSymbolSelector';

const TokenSymbolSelector = ({ tokens, ...props }: Props) => {
  const tokenOptions = useMemo(
    () =>
      tokens.map((token: AnyToken | SafeToken) => {
        const labelElement = (
          elementType: 'labelElement' | 'optionElement',
        ) => (
          <div className={styles[elementType]}>
            <TokenIcon
              token={token}
              name={token.name || undefined}
              size="xxs"
            />
            <span
              className={elementType === 'labelElement' ? styles.symbol : ''}
            >
              {token.symbol || '???'}
            </span>
          </div>
        );

        return {
          value: token.address,
          label: token.symbol,
          labelElement: labelElement('labelElement'),
          children: labelElement('optionElement'),
        };
      }),
    [tokens],
  );

  return <Select options={tokenOptions} {...props} />;
};

TokenSymbolSelector.displayName = displayName;

export default TokenSymbolSelector;
