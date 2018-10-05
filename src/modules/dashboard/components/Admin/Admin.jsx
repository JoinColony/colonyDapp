/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import AdminNavigation from './AdminNavigation.jsx';

import styles from './Admin.css';

const MSG = defineMessages({
  tabColonyProfile: {
    id: 'dashboard.Dashboard.tabColonyProfile',
    defaultMessage: 'Colony Profile',
  },
  tabAdvanced: {
    id: 'dashboard.Dashboard.tabAdvanced',
    defaultMessage: 'Advanced',
  },
});

type Props = {};

type State = {};

export default class Admin extends Component<Props, State> {
  static displayName = 'dashboard.Admin';

  state = {};

  render() {
    return (
      <div className={styles.main}>
        <aside className={styles.colonyInfo}>
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
