/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import OrganizationsAdmins from './OrganizationsAdmins.jsx';

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
  <div className={styles.tempAdminMain}>
    <aside className={styles.tempAdminNav}>Navigation</aside>
    <div className={styles.main}>
      <Tabs>
        <TabList>
          <Tab>
            <FormattedMessage {...MSG.tabAdmins} />
          </Tab>
        </TabList>
        <TabPanel>
          <OrganizationsAdmins />
        </TabPanel>
      </Tabs>
    </div>
  </div>
);

Organizations.displayName = displayName;

export default Organizations;
