import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import { Checkbox } from '~core/Fields';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyToken } from '~data/index';

import styles from './TokenItem.css';

const MSG = defineMessages({
  unknownToken: {
    id: 'core.TokenEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  token: AnyToken;
  disabled?: boolean;
}

const TokenItem = ({ token, disabled = false }: Props) => {
  return (
    <div className={styles.main} data-test="tokenEditItem">
      <div className={styles.tokenChoice}>
        <Checkbox
          name="selectedTokenAddresses"
          value={token.address}
          className={styles.checkbox}
          disabled={disabled}
        />
        <TokenIcon token={token} name={token.name || undefined} size="xs" />
        <span className={styles.tokenChoiceSymbol}>
          <Heading
            text={token.symbol || token.name || MSG.unknownToken}
            appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
          />
          {(!!token.symbol && token.name) || token.address}
        </span>
      </div>
    </div>
  );
};

TokenItem.displayName = 'core.TokenEditDialog.TokenItem';

export default TokenItem;
