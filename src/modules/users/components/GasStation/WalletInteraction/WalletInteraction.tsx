import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WalletKind } from '~immutable/index';

import Icon from '~core/Icon';

import styles from './WalletInteraction.css';

const MSG = defineMessages({
  walletPromptText: {
    id: 'users.GasStation.WalletInteraction.walletPromptText',
    defaultMessage: `Please finish this action on {walletKind, select,
      MetaMask {MetaMask}
      HardWare {your hardware wallet}
    }`,
  },
  hardware: {
    id: 'users.GasStation.WalletInteraction.hardware',
    defaultMessage: 'Hardware Wallet',
  },
});

interface Props {
  walletKind: WalletKind;
}

const displayName = 'users.GasStation.WalletInteraction';

const WalletInteraction = ({ walletKind }: Props) => {
  if (walletKind === WalletKind.Software) {
    return null;
  }
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        {walletKind === WalletKind.MetaMask && (
          <Icon
            name="metamask"
            title={{ id: 'wallet.metamask' }}
            appearance={{ size: 'medium' }}
          />
        )}
        {walletKind === WalletKind.Hardware && (
          <Icon
            name="wallet"
            title={MSG.hardware}
            appearance={{ size: 'medium' }}
          />
        )}
        <span className={styles.text}>
          <FormattedMessage {...MSG.walletPromptText} values={{ walletKind }} />
        </span>
      </div>
    </div>
  );
};

WalletInteraction.displayName = displayName;

export default WalletInteraction;
