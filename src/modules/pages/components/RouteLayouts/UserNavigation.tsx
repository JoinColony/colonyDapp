import React from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import { GasStationPopover } from '~users/GasStation';
import AvatarDropdown from '~users/AvatarDropdown';
import { InboxIcon } from '~users/Inbox';
import InboxPopover from '~users/Inbox/InboxPopover';
import { ConnectWalletPopover } from '~users/ConnectWalletWizard';
import { useUserNotificationsQuery, useLoggedInUser } from '~data/index';

import styles from './UserNavigation.css';

const MSG = defineMessages({
  dashboardTitle: {
    id: 'pages.NavigationWrapper.UserNavigation.dashboardTitle',
    defaultMessage: 'Go to your Dashboard',
  },
  walletTitle: {
    id: 'pages.NavigationWrapper.UserNavigation.walletTitle',
    defaultMessage: 'Go to your Wallet',
  },
  inboxTitle: {
    id: 'pages.NavigationWrapper.UserNavigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
});

const displayName = 'pages.NavigationWrapper.UserNavigation';

const UserNavigation = () => {
  const { walletAddress, ethereal } = useLoggedInUser();

  const WalletComponent = ethereal ? ConnectWalletPopover : GasStationPopover;

  const { data } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const notifications = (data && data.user && data.user.notifications) || [];

  return (
    <div className={styles.main}>
      <WalletComponent>
        {({ isOpen, toggle, ref }) => (
          <button
            type="button"
            className={styles.navigationItemButton}
            ref={ref}
            onClick={toggle}
          >
            <div
              className={`${styles.navigationItem} ${
                isOpen ? styles.navigationItemActive : ''
              }`}
            >
              <Icon name="wallet" title={MSG.walletTitle} />
            </div>
          </button>
        )}
      </WalletComponent>
      <InboxPopover notifications={notifications}>
        {({ isOpen, toggle, ref }) => (
          <button
            type="button"
            className={styles.navigationItemButton}
            ref={ref}
            onClick={toggle}
          >
            <div
              className={`${styles.navigationItem} ${
                isOpen ? styles.navigationItemActive : ''
              }`}
            >
              <InboxIcon
                activeClassName={styles.navigationItemActive}
                notifications={notifications}
                title={MSG.inboxTitle}
              />
            </div>
          </button>
        )}
      </InboxPopover>
      <AvatarDropdown />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
