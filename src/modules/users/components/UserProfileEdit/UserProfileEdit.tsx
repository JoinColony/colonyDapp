import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { Tab, TabList, TabPanel, Tabs } from '~core/Tabs';

import ProfileTemplate from '~pages/ProfileTemplate';
import { useLoggedInUser, useUser } from '~data/index';
import { LANDING_PAGE_ROUTE } from '~routes/index';

import UserProfileSpinner from '../UserProfile/UserProfileSpinner';
import Sidebar from './Sidebar';
import UserMainSettings from './UserMainSettings';
import UserAdvanceSettings from './UserAdvanceSettings';

const MSG = defineMessages({
  headingMain: {
    id: 'users.UserProfileEdit.headingMain',
    defaultMessage: 'User profile',
  },
  headingAdvance: {
    id: 'users.UserProfileEdit.headingAdvance',
    defaultMessage: 'Advanced settings',
  },
});

const displayName = 'users.UserProfileEdit';

const UserProfileEdit = () => {
  const { walletAddress, ethereal } = useLoggedInUser();

  const user = useUser(walletAddress);

  if (!user) {
    return <UserProfileSpinner />;
  }

  if (ethereal) {
    return <Redirect to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<Sidebar user={user} />}
    >
      <Tabs>
        <TabList>
          <Tab>
            <FormattedMessage {...MSG.headingMain} />
          </Tab>
          <Tab>
            <FormattedMessage {...MSG.headingAdvance} />
          </Tab>
        </TabList>
        <TabPanel>
          <UserMainSettings user={user} />
        </TabPanel>
        <TabPanel>
          <UserAdvanceSettings user={user} />
        </TabPanel>
      </Tabs>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
