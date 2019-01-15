/* @flow */

import React, { Component } from 'react';

import { defineMessages } from 'react-intl';

import { INBOX_ROUTE, DASHBOARD_ROUTE } from '~routes';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import { PopoverProvider, RegisteredPopover } from '~core/Popover';
import GasStation from '~users/GasStation';
import AvatarDropdown from '~users/AvatarDropdown';

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

type Props = {
  events?: Array<{ handled: boolean }>,
};

type State = {
  transactionCount: number,
};

class UserNavigation extends Component<Props, State> {
  static displayName = 'pages.NavigationWrapper.UserNavigation';

  static state = {
    transactionCount: 0,
  };

  render() {
    const { events = mockEvents } = this.props;
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
        <PopoverProvider>
          <RegisteredPopover
            appearance={{ theme: 'grey' }}
            content={({ close }) => <GasStation close={close} />}
            name="GasStationPopover"
            placement="bottom"
            showArrow={false}
          >
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
          </RegisteredPopover>
        </PopoverProvider>
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
  }
}

export default UserNavigation;
