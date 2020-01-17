import React from 'react';
import { defineMessages } from 'react-intl';

import { Checkbox } from '~core/Fields';
import Heading from '~core/Heading';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { FullColonyFragment } from '~data/index';
import { Address } from '~types/index';

import { tokenIsETH } from '../../checks';

import styles from './TokenEditDialog.css';

const MSG = defineMessages({
  unknownToken: {
    id: 'core.TokenEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  nativeTokenAddress?: Address;
  token: FullColonyFragment['tokens'][0];
}

const TokenCheckbox = ({ nativeTokenAddress, token }: Props) => {
  return (
    <Checkbox
      className={styles.tokenChoice}
      value={token.address}
      name="tokens"
      disabled={nativeTokenAddress === token.address || tokenIsETH(token)}
    >
      <TokenIcon token={token} name={token.name || undefined} />
      <span className={styles.tokenChoiceSymbol}>
        <Heading
          text={token.symbol || token.name || MSG.unknownToken}
          appearance={{ size: 'small', margin: 'none' }}
        />
        {(!!token.symbol && token.name) || token.address}
      </span>
    </Checkbox>
  );
};

TokenCheckbox.displayName = 'core.TokenEditDialog.TokenCheckbox';

export default TokenCheckbox;
