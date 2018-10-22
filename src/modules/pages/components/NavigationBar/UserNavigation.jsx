/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE, USER_ROUTE, WALLET_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import AvatarDropdown from '~user/AvatarDropdown';

import styles from './UserNavigation.css';

const displayName = 'pages.NavigationBar.UserNavigation';

const MSG = defineMessages({
  dashboardTitle: {
    id: 'pages.NavigationBar.UserNavigation.dashboardTitle',
    defaultMessage: 'Go to your Dashboard',
  },
  walletTitle: {
    id: 'pages.NavigationBar.UserNavigation.walletTitle',
    defaultMessage: 'Go to your Wallet',
  },
  inboxTitle: {
    id: 'pages.NavigationBar.UserNavigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
});

type Props = {
  events?: Array<{ handled: boolean }>,
};

const UserNavigation = ({ events }: Props) => {
  const unhandled = events && !events.find(event => !event.handled);
  return (
    <nav className={styles.main}>
      <NavLink
        to={USER_ROUTE}
        className={styles.navigationItem}
        activeClassName={styles.navigationItemActive}
      >
        <Icon name="home" title={MSG.dashboardTitle} />
      </NavLink>
      <NavLink
        to={WALLET_ROUTE}
        className={styles.navigationItem}
        activeClassName={styles.navigationItemActive}
      >
        <Icon name="wallet" title={MSG.walletTitle} />
      </NavLink>
      <NavLink
        to={INBOX_ROUTE}
        className={`${
          unhandled ? styles.navigationItemHasCircle : styles.navigationItem
        }`}
        activeClassName={styles.navigationItemActive}
      >
        <Icon name="envelope" title={MSG.inboxTitle} />
      </NavLink>
      <AvatarDropdown />
    </nav>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
