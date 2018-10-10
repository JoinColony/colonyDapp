/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import styles from './Organizations.css';

const MSG = defineMessages({
  tabContributors: {
    id: 'admin.Organizations.tabContributors',
    defaultMessage: 'Contributors',
  },
  tabAdmins: {
    id: 'admin.Organizations.tabAdmins',
    defaultMessage: 'Admins',
  },
  tabDomains: {
    id: 'admin.Organizations.tabDomains',
    defaultMessage: 'Domains',
  },
});

const displayName: string = 'admin.Organizations';

const Organizations = () => (
  <div className={styles.main}>
    <Tabs>
      <TabList>
        <Tab>
          <FormattedMessage {...MSG.tabContributors} />
        </Tab>
        <Tab>
          <FormattedMessage {...MSG.tabAdmins} />
        </Tab>
        <Tab>
          <FormattedMessage {...MSG.tabDomains} />
        </Tab>
      </TabList>
      <TabPanel>Contributors panel content</TabPanel>
      <TabPanel>Admins panel content</TabPanel>
      <TabPanel>Domains panel content</TabPanel>
    </Tabs>
  </div>
);

Organizations.displayName = displayName;

export default Organizations;
