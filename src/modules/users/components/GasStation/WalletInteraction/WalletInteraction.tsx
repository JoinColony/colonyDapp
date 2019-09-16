import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WALLET_CATEGORIES } from '~immutable/index';

import Icon from '~core/Icon';

import styles from './WalletInteraction.css';

const MSG = defineMessages({
  walletPromptText: {
    id: 'users.GasStation.WalletInteraction.walletPromptText',
    defaultMessage: `Please finish this action on {walletType, select,
      metamask {MetaMask}
      hardware {your hardware wallet}
    }`,
  },
  hardware: {
    id: 'users.GasStation.WalletInteraction.hardware',
    defaultMessage: 'Hardware Wallet',
  },
});

interface Props {
  walletType: WALLET_CATEGORIES;
}

const displayName = 'users.GasStation.WalletInteraction';

const WalletInteraction = ({ walletType }: Props) => {
  if (walletType === WALLET_CATEGORIES.SOFTWARE) {
    return null;
  }
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        {walletType === WALLET_CATEGORIES.METAMASK && (
          <Icon
            name="metamask"
            title={{ id: 'wallet.metamask' }}
            appearance={{ size: 'medium' }}
          />
        )}
        {walletType === WALLET_CATEGORIES.HARDWARE && (
          <Icon
            name="wallet"
            title={MSG.hardware}
            appearance={{ size: 'medium' }}
          />
        )}
        <span className={styles.text}>
          <FormattedMessage {...MSG.walletPromptText} values={{ walletType }} />
        </span>
      </div>
    </div>
  );
};

WalletInteraction.displayName = displayName;

export default WalletInteraction;
