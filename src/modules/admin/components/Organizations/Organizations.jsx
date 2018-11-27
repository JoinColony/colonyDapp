/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Heading from '~core/Heading';
import UserList from '../UserList';
import OrganizationAddAdmins from './OrganizationAddAdmins.jsx';

import styles from './Organizations.css';

import usersMocks from './__datamocks__/usersMocks';

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
  labelAdminList: {
    id: 'admin.Organizations.labelAdminList',
    defaultMessage: 'Name',
  },
  noCurrentAdmins: {
    id: 'admin.Organizations.noCurrentAdmins',
    defaultMessage: `
      It looks like no admins are currently added to this colony. You can one
      by selecting it from the list above.
    `,
  },
});

const displayName: string = 'admin.Organizations';

const Organizations = () => (
  <div className={styles.main}>
    <Tabs>
      <TabList>
        <Tab>
          <FormattedMessage {...MSG.tabAdmins} />
        </Tab>
      </TabList>
      <TabPanel>
        <OrganizationAddAdmins availableAdmins={usersMocks} />
        <div className={styles.userListWrapper}>
          {/*
            * UserList follows the design principles from TaskList in dashboard,
            * but if it turns out we're going to use this in multiple places,
            * we should consider moving it to core
            */}
          {usersMocks && usersMocks.length ? (
            <UserList
              users={usersMocks}
              label={MSG.labelAdminList}
              showDisplayName
              showUsername
              showMaskedAddress
              viewOnly={false}
              // eslint-disable-next-line no-console
              onRemove={console.log}
            />
          ) : (
            <Fragment>
              <Heading
                appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
                text={MSG.labelAdminList}
              />
              <p className={styles.noCurrentAdmins}>
                <FormattedMessage {...MSG.noCurrentAdmins} />
              </p>
            </Fragment>
          )}
        </div>
      </TabPanel>
    </Tabs>
  </div>
);

Organizations.displayName = displayName;

export default Organizations;
