/* @flow */

import React from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE, DASHBOARD_ROUTE, WALLET_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import AvatarDropdown from '~user/AvatarDropdown';

import styles from './UserNavigation.css';

/*
 * Mocked Events
 *
 * These should be added directly in here, so we won't have to deal with passing
 * down of props
 *
 * @TODO replace this with actual events, not sure where they will me from yet
 */
const mockEvents = [{ handled: true }];

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

type Props = {
  events?: Array<{ handled: boolean }>,
};

const UserNavigation = ({ events = mockEvents }: Props) => {
  const unhandled = events && !events.find(event => !event.handled);
  return (
    <nav className={styles.main}>
      <NavLink
        to={DASHBOARD_ROUTE}
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
