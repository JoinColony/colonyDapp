/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';

import styles from './WalletInteraction.css';

const MSG = defineMessages({
  walletPromptText: {
    id: 'users.GasStation.WalletInteraction.walletPromptText',
    defaultMessage: `Please finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}
    }`,
  },
  metamask: {
    id: 'users.GasStation.WalletInteraction.metamask',
    defaultMessage: 'Metamask Wallet',
  },
  hardware: {
    id: 'users.GasStation.WalletInteraction.hardware',
    defaultMessage: 'Hardware Wallet',
  },
});

type Props = {
  walletType: 'metamask' | 'hardware' | 'software',
};

const displayName = 'users.GasStation.WalletInteraction';

const WalletInteraction = ({ walletType }: Props) => {
  if (walletType === 'software') {
    return null;
  }
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        {walletType === 'metamask' && (
          <Icon
            name="metamask"
            title={MSG.metamask}
            appearance={{ size: 'medium' }}
          />
        )}
        {walletType === 'hardware' && (
          <Icon
            name="wallet"
            title={MSG.metamask}
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
