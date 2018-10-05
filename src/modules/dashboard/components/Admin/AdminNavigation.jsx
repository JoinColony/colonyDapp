/* @flow */
import React from 'react';

import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import styles from './AdminNavigation.css';

const displayName = 'users.AdminNavigation';

const MSG = defineMessages({
  colonySettings: {
    id: 'dashboard.Admin.AdminNavigation.colonySettings',
    defaultMessage: 'Colony Settings',
  },
  tabProfile: {
    id: 'dashboard.Admin.AdminNavigation.tabProfile',
    defaultMessage: 'Go to your Wallet',
  },
  tabTokens: {
    id: 'dashboard.Admin.AdminNavigation.tabTokens',
    defaultMessage: 'Tokens',
  },
  tabTransaction: {
    id: 'dashboard.Admin.AdminNavigation.tabTransaction',
    defaultMessage: 'Transaction',
  },
  tabOrganisation: {
    id: 'dashboard.Admin.AdminNavigation.tabOrganisation',
    defaultMessage: 'Organisation',
  },
});

const AdminNavigation = () => (
  <nav>
    <Tabs className={styles.navigationTabContainer}>
      <TabList appearance={{ theme: 'vertical' }} headline={MSG.colonySettings}>
        <Tab className={styles.oneTab}>
          <FormattedMessage {...MSG.tabProfile} />
        </Tab>
        <Tab className={styles.oneTab}>
          <FormattedMessage {...MSG.tabTokens} />
        </Tab>
        <Tab className={styles.oneTab}>
          <FormattedMessage {...MSG.tabTransaction} />
        </Tab>
        <Tab className={styles.oneTab}>
          <FormattedMessage {...MSG.tabOrganisation} />
        </Tab>
      </TabList>
      <TabPanel />
      <TabPanel />
      <TabPanel />
      <TabPanel />
    </Tabs>
  </nav>
);

AdminNavigation.displayName = displayName;

export default AdminNavigation;
