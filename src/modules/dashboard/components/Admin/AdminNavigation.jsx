/* @flow */
import React from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE, USER_ROUTE, WALLET_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './AdminNavigation.css';

const displayName = 'users.AdminNavigation';

const MSG = defineMessages({
  dashboardTitle: {
    id: 'AdminNavigation.dashboardTitle',
    defaultMessage: 'Go to your Dashboard',
  },
  walletTitle: {
    id: 'AdminNavigation.walletTitle',
    defaultMessage: 'Go to your Wallet',
  },
  inboxTitle: {
    id: 'AdminNavigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
});

const AdminNavigation = () => (
  <nav className={styles.main}>
    <NavLink
      to={USER_ROUTE}
      className={styles.adminNavigationItem}
      activeClassName={styles.adminNavigationItemActive}
    >
      Profile
    </NavLink>
    <NavLink
      to={USER_ROUTE}
      className={styles.adminNavigationItem}
      activeClassName={styles.adminNavigationItemActive}
    >
      Tokens
    </NavLink>
    <NavLink
      to={USER_ROUTE}
      className={styles.adminNavigationItem}
      activeClassName={styles.adminNavigationItemActive}
    >
      Transaction
    </NavLink>
    <NavLink
      to={USER_ROUTE}
      className={styles.adminNavigationItem}
      activeClassName={styles.adminNavigationItemActive}
    >
      Organisation
    </NavLink>
  </nav>
);

AdminNavigation.displayName = displayName;

export default AdminNavigation;
