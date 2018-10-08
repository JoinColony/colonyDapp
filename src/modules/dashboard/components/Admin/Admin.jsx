/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import NavLink from '~core/NavLink';
import Icon from '~core/Icon';

import AdminNavigation from './AdminNavigation.jsx';

import styles from './Admin.css';

const MSG = defineMessages({
  tabColonyProfile: {
    id: 'dashboard.Admin.tabColonyProfile',
    defaultMessage: 'Colony Profile',
  },
  tabAdvanced: {
    id: 'dashboard.Admin.tabAdvanced',
    defaultMessage: 'Advanced',
  },
  backButton: {
    id: 'dashboard.Admin.backButton',
    defaultMessage: 'Go to {colonyName}',
  },
});

type Props = {};

type State = {};

export default class Admin extends Component<Props, State> {
  colonyName: 'Colony';

  static displayName = 'dashboard.Admin';

  state = {};

  componentWillMount() {
    // TODO: get current Colony from Redux
    this.colonyName = 'Colony';
  }

  render() {
    return (
      <div className={styles.main}>
        <aside className={styles.colonyInfo}>
          <header className={styles.header}>
            <Icon name="back" title="back" appearance={{ size: 'medium' }} />
            <NavLink to="/colony">
              <FormattedMessage
                {...MSG.backButton}
                values={{
                  colonyName: this.colonyName,
                }}
              />
            </NavLink>
          </header>
          <AdminNavigation />
        </aside>
        <main className={styles.content}>
          <Tabs>
            <TabList>
              <Tab>
                <FormattedMessage {...MSG.tabColonyProfile} />
              </Tab>
              <Tab>
                <FormattedMessage {...MSG.tabAdvanced} />
              </Tab>
            </TabList>
            <TabPanel />
            <TabPanel />
          </Tabs>
        </main>
        <aside className={styles.sidebar} />
      </div>
    );
  }
}
