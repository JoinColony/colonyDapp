/* @flow */
import React from 'react';

import { defineMessages } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import styles from './AdminNavigation.css';

const displayName = 'users.AdminNavigation';

const MSG = defineMessages({
  colonySettings: {
    id: 'AdminNavigation.colonySettings',
    defaultMessage: 'Colony Settings',
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
  <nav>
    <Tabs className={styles.navigationTabContainer}>
      <TabList appearance={{ theme: 'vertical' }} headline={MSG.colonySettings}>
        <Tab className={styles.oneTab}>Profile</Tab>
        <Tab className={styles.oneTab}>Tokens</Tab>
        <Tab className={styles.oneTab}>Transaction</Tab>
        <Tab className={styles.oneTab}>Organisation</Tab>
      </TabList>
    </Tabs>
    <TabPanel>
      <div className={styles.placeHolder} />
    </TabPanel>
    <TabPanel>
      <div className={styles.placeHolder} />
    </TabPanel>
    <TabPanel>
      <div className={styles.placeHolder} />
    </TabPanel>
    <TabPanel>
      <div className={styles.placeHolder} />
    </TabPanel>
  </nav>
);

AdminNavigation.displayName = displayName;

export default AdminNavigation;
