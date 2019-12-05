import React from 'react';
import { defineMessages } from 'react-intl';

import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import Numeral from '~core/Numeral';
import { WALLET_ROUTE } from '~routes/index';
import { useLoggedInUser } from '~data/helpers';

import styles from './GasStationHeader.css';

const MSG = defineMessages({
  goToWalletLinkTitle: {
    id: 'users.GasStation.GasStationHeader.goToWalletLinkTitle',
    defaultMessage: 'Go to Wallet',
  },
});

interface Props {
  close?: () => void;
}

const displayName = 'users.GasStation.GasStationHeader';

const GasStationHeader = ({ close }: Props) => {
  const { balance, walletAddress } = useLoggedInUser();
  return (
    <div className={styles.main}>
      <div className={styles.walletDetails}>
        <div className={styles.walletHeading}>
          <Heading
            appearance={{ margin: 'none', size: 'normal' }}
            text={{ id: 'wallet' }}
          />
        </div>
        <div className={styles.walletAddress}>
          <CopyableAddress>{walletAddress}</CopyableAddress>
        </div>
        <div>
          <Numeral value={balance} suffix=" ETH" />
        </div>
      </div>
      <div className={styles.actionsContainer}>
        <Link to={WALLET_ROUTE}>
          <div className={styles.goToWalletIcon}>
            <Icon
              appearance={{ size: 'medium' }}
              name="arrow-wallet"
              title={MSG.goToWalletLinkTitle}
            />
          </div>
        </Link>
        {close && (
          <button className={styles.closeButton} onClick={close} type="button">
            <Icon
              appearance={{ size: 'normal' }}
              name="close"
              title={{ id: 'button.close' }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

GasStationHeader.displayName = displayName;

export default GasStationHeader;
