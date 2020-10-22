import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { GasStationPopover } from '~users/GasStation';
import AvatarDropdown from '~users/AvatarDropdown';
import { InboxIcon } from '~users/Inbox';
import InboxPopover from '~users/Inbox/InboxPopover';
import { ConnectWalletPopover } from '~users/ConnectWalletWizard';
import { useUserNotificationsQuery, useLoggedInUser } from '~data/index';
import MaskedAddress from '~core/MaskedAddress';

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

  const WalletPopover = ethereal ? ConnectWalletPopover : GasStationPopover;

  const { data } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const notifications = (data && data.user && data.user.notifications) || [];

  return (
    <div className={styles.main}>
      {!ethereal && (
        <div className={styles.networkInfo}>
          {DEFAULT_NETWORK_INFO.shortName}
        </div>
      )}
      <WalletPopover>
        {({ isOpen, toggle, ref }) =>
          ethereal ? (
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
          ) : (
            <button
              type="button"
              className={
                isOpen ? styles.walletAddressActive : styles.walletAddress
              }
              ref={ref}
              onClick={toggle}
            >
              <MaskedAddress address={walletAddress} />
            </button>
          )
        }
      </WalletPopover>
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
