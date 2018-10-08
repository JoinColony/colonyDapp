/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import styles from './Profile.css';

const MSG = defineMessages({
  tabProfile: {
    id: 'admin.Profile.tabProfile',
    defaultMessage: 'Colony Profile',
  },
  tabAdvaced: {
    id: 'admin.Profile.tabAdvaced',
    defaultMessage: 'Advanced',
  },
});

const displayName: string = 'admin.Profile';

const Profile = () => (
  <div className={styles.main}>
    <Tabs>
      <TabList>
        <Tab>
          <FormattedMessage {...MSG.tabProfile} />
        </Tab>
        <Tab>
          <FormattedMessage {...MSG.tabAdvaced} />
        </Tab>
      </TabList>
      <TabPanel>Colony Profile Tab Content</TabPanel>
      <TabPanel>Advanced Tab Content</TabPanel>
    </Tabs>
  </div>
);

Profile.dispalyName = displayName;

export default Profile;
