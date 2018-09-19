/* @flow */
import React from 'react';

import { defineMessages } from 'react-intl';

import Icon from '~core/Icon';
import Link from '~core/Link';

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
    <Link to="/" className={styles.navigationItem}>
      <Icon name="home" title={MSG.dashboardTitle} />
    </Link>
    <Link to="/" className={styles.navigationItem}>
      <Icon name="wallet" title={MSG.walletTitle} />
    </Link>
    <Link to="/" className={styles.navigationItem}>
      <Icon name="envelope" title={MSG.inboxTitle} />
    </Link>
  </nav>
);

Navigation.displayName = displayName;

export default Navigation;
