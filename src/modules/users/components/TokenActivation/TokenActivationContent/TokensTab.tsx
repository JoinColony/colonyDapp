import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import styles from './TokenActivationContent.css';

const MSG = defineMessages({
  active: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.active',
    defaultMessage: 'Active',
  },
  inactive: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.inactive',
    defaultMessage: 'Inactive',
  },
  changeState: {
    id: 'users.TokenActivation.TokenActivationContent.TokensTab.changeState',
    defaultMessage: 'Change token state',
  },
});

export interface TokensTabProps {
  activeTokens: number;
  inactiveTokens: number;
  tokenSymbol: string;
}

const TokensTab = ({
  activeTokens,
  inactiveTokens,
  tokenSymbol,
}: TokensTabProps) => {
  return (
    <>
      <div className={styles.totalTokens}>{`SYMBOL plchd${
        activeTokens + inactiveTokens
      } ${tokenSymbol}`}</div>
      <div className={styles.tokensDetails}>
        <div>
          <FormattedMessage {...MSG.active} />
        </div>
        <div>{`${activeTokens} ${tokenSymbol}`}</div>
        <div>Totoal tokens placeholder?</div>
        <div>
          <FormattedMessage {...MSG.inactive} />
        </div>
        <div>{`${inactiveTokens} ${tokenSymbol}`}</div>
      </div>
      <div className={styles.changeTokensState}>
        <div>
          <FormattedMessage {...MSG.changeState} />
        </div>
      </div>
    </>
  );
};

export default TokensTab;
