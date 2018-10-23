/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE, USER_ROUTE, WALLET_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './NavigationBar.css';

const displayName = 'user.NavigationBar';

const MSG = defineMessages({
  dashboardTitle: {
    id: `${displayName}.dashboardTitle`,
    defaultMessage: 'Go to your Dashboard',
  },
  walletTitle: {
    id: `${displayName}.walletTitle`,
    defaultMessage: 'Go to your Wallet',
  },
  inboxTitle: {
    id: `${displayName}.inboxTitle`,
    defaultMessage: 'Go to your Inbox',
  },
});

type Props = {
  events?: Array<{ handled: boolean }>,
};

const NavigationBar = ({ events }: Props) => {
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
    </nav>
  );
};

NavigationBar.displayName = displayName;

export default NavigationBar;
