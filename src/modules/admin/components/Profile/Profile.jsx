/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';

import ProfileEdit from './ProfileEdit.jsx';
import ProfileAdvanced from './ProfileAdvanced.jsx';

import styles from './Profile.css';

import type { ColonyType } from '~immutable';

type Props = {|
  colony: ColonyType,
|};

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

const Profile = ({ colony }: Props) => (
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
      <TabPanel
        className={styles.overwrittenTabPanel}
        selectedClassName={styles.overwrittenSelectedTabPanel}
      >
        <ProfileEdit colony={colony} />
      </TabPanel>
      <TabPanel>
        <ProfileAdvanced colony={colony} />
      </TabPanel>
    </Tabs>
  </div>
);

Profile.displayName = displayName;

export default Profile;
