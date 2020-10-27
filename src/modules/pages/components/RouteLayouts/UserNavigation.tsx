import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { GasStationPopover } from '~users/GasStation';
import { readyTransactionsCount } from '~users/GasStation/transactionGroup';
import AvatarDropdown from '~users/AvatarDropdown';
import { InboxIcon } from '~users/Inbox';
import InboxPopover from '~users/Inbox/InboxPopover';
import { ConnectWalletPopover } from '~users/ConnectWalletWizard';
import { useUserNotificationsQuery, useLoggedInUser } from '~data/index';
import MaskedAddress from '~core/MaskedAddress';
import { groupedTransactionsAndMessages } from '../../../core/selectors';
import { useSelector } from '~utils/hooks';

import { DEFAULT_NETWORK_INFO } from '~constants';

import styles from './UserNavigation.css';

const MSG = defineMessages({
  inboxTitle: {
    id: 'pages.NavigationWrapper.UserNavigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
  connectWallet: {
    id: 'pages.NavigationWrapper.UserNavigation.connectWallet',
    defaultMessage: 'Connect Wallet',
  },
});

const displayName = 'pages.NavigationWrapper.UserNavigation';

const UserNavigation = () => {
  const { walletAddress, ethereal } = useLoggedInUser();

  const { data } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const notifications = (data && data.user && data.user.notifications) || [];

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  const readyTransactions = useMemo(
    () => readyTransactionsCount(transactionAndMessageGroups),
    [transactionAndMessageGroups],
  );

  return (
    <div className={styles.main}>
      {!ethereal && (
        <div className={styles.networkInfo}>
          {DEFAULT_NETWORK_INFO.shortName}
        </div>
      )}
      {ethereal ? (
        <ConnectWalletPopover>
          {({ isOpen, toggle, ref }) => (
            <button
              type="button"
              className={
                isOpen
                  ? styles.connectWalletButtonActive
                  : styles.connectWalletButton
              }
              ref={ref}
              onClick={toggle}
            >
              <FormattedMessage {...MSG.connectWallet} />
            </button>
          )}
        </ConnectWalletPopover>
      ) : (
        <GasStationPopover
          transactionAndMessageGroups={transactionAndMessageGroups}
        >
          {({ isOpen, toggle, ref }) => (
            <button
              type="button"
              className={
                isOpen ? styles.walletAddressActive : styles.walletAddress
              }
              ref={ref}
              onClick={toggle}
            >
              <MaskedAddress address={walletAddress} />
              {readyTransactions >= 1 && (
                <span className={styles.readyTransactionsCount}>
                  {readyTransactions}
                </span>
              )}
            </button>
          )}
        </GasStationPopover>
      )}
      {!ethereal && (
        <InboxPopover notifications={notifications}>
          {({ isOpen, toggle, ref }) => (
            <button
              type="button"
              className={styles.notificationsButton}
              ref={ref}
              onClick={toggle}
            >
              <div
                className={`${styles.notificationsIcon} ${
                  isOpen ? styles.notificationsIconActive : ''
                }`}
              >
                <InboxIcon
                  notifications={notifications}
                  title={MSG.inboxTitle}
                />
              </div>
            </button>
          )}
        </InboxPopover>
      )}
      <AvatarDropdown />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
