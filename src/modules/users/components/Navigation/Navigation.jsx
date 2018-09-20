/* @flow */
import React from 'react';

import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './Navigation.css';

const displayName = 'users.Navigation';

const MSG = defineMessages({
  dashboardTitle: {
    id: 'Navigation.dashboardTitle',
    defaultMessage: 'Go to your Dashboard',
  },
  walletTitle: {
    id: 'Navigation.walletTitle',
    defaultMessage: 'Go to your Wallet',
  },
  inboxTitle: {
    id: 'Navigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
});

const Navigation = () => (
  <nav className={styles.main}>
    <NavLink
      to="/profile"
      className={styles.navigationItem}
      activeClassName={styles.navigationItemActive}
    >
      <Icon name="home" title={MSG.dashboardTitle} />
    </NavLink>
    <NavLink
      to="/wallet"
      className={styles.navigationItem}
      activeClassName={styles.navigationItemActive}
    >
      <Icon name="wallet" title={MSG.walletTitle} />
    </NavLink>
    <NavLink
      to="/inbox"
      className={styles.navigationItem}
      activeClassName={styles.navigationItemActive}
    >
      <Icon name="envelope" title={MSG.inboxTitle} />
    </NavLink>
  </nav>
);

Navigation.displayName = displayName;

export default Navigation;
