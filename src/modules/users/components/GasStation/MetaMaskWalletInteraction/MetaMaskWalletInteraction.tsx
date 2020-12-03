import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';

import styles from './MetaMaskWalletInteraction.css';

const MSG = defineMessages({
  metamaskPromptText: {
    id: 'users.GasStation.MetaMaskWalletInteraction.metamaskPromptText',
    defaultMessage: `Please finish this action on MetaMask`,
  },
});

const displayName = 'users.GasStation.MetaMaskWalletInteraction';

const MetaMaskWalletInteraction = () => {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Icon
          name="metamask"
          title={{ id: 'wallet.metamask' }}
          appearance={{ size: 'medium' }}
        />
        <span className={styles.text}>
          <FormattedMessage {...MSG.metamaskPromptText} />
        </span>
      </div>
    </div>
  );
};

MetaMaskWalletInteraction.displayName = displayName;

export default MetaMaskWalletInteraction;
