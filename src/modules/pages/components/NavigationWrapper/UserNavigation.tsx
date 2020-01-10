import React from 'react';
import { defineMessages } from 'react-intl';

import { DASHBOARD_ROUTE } from '~routes/index';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import { GasStationPopover } from '~users/GasStation';
import AvatarDropdown from '~users/AvatarDropdown';
import { InboxIcon } from '~users/Inbox';
import InboxPopover from '~users/Inbox/InboxPopover';
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
  const { walletAddress } = useLoggedInUser();

  const { data } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const notifications = (data && data.user && data.user.notifications) || [];

  return (
    <div className={styles.main}>
      <NavLink
        to={DASHBOARD_ROUTE}
        className={styles.navigationItem}
        activeClassName={styles.navigationItemActive}
        data-test="goToDashboard"
      >
        <Icon name="home" title={MSG.dashboardTitle} />
      </NavLink>
      <GasStationPopover>
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
      </GasStationPopover>
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
