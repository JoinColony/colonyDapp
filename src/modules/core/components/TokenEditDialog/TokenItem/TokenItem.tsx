import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { AnyToken } from '~data/index';
import { Address } from '~types/index';

import { tokenIsETH } from '../../../checks';

import styles from './TokenItem.css';
import Button from '~core/Button';

const MSG = defineMessages({
  unknownToken: {
    id: 'core.TokenEditDialog.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  nativeTokenAddress?: Address;
  removeTokenFn: (address: Address) => void;
  token: AnyToken;
}

const TokenItem = ({ nativeTokenAddress, removeTokenFn, token }: Props) => {
  const canRemoveToken =
    nativeTokenAddress !== token.address && !tokenIsETH(token);
  return (
    <div className={styles.main}>
      <div className={styles.tokenChoice}>
        <TokenIcon token={token} name={token.name || undefined} />
        <span className={styles.tokenChoiceSymbol}>
          <Heading
            text={token.symbol || token.name || MSG.unknownToken}
            appearance={{ size: 'small', margin: 'none' }}
          />
          {(!!token.symbol && token.name) || token.address}
        </span>
      </div>
      {canRemoveToken && (
        <div>
          <Button
            appearance={{ theme: 'dangerLink' }}
            text={{ id: 'button.remove' }}
            onClick={() => removeTokenFn(token.address)}
          />
        </div>
      )}
    </div>
  );
};

TokenItem.displayName = 'core.TokenEditDialog.TokenItem';

export default TokenItem;
