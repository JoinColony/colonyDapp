/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Heading from '~core/Heading';
import UserList from '../UserList';
import DomainList from '../DomainList';
import OrganizationAddAdmins from './OrganizationAddAdmins.jsx';
import OrganizationAddDomains from './OrganizationAddDomains.jsx';

import styles from './Organizations.css';

import usersMocks from './__datamocks__/usersMocks';
import domainMocks from './__datamocks__/domainMocks';

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
    defaultMessage: 'Domains',
  },
  noCurrentAdmins: {
    id: 'admin.Organizations.noCurrentAdmins',
    defaultMessage: `
      It looks like no admins are currently added to this colony. You can add one
      by selecting it from the list above.
    `,
  },
  noCurrentDomains: {
    id: 'admin.Organizations.noCurrentDomains',
    defaultMessage: `
      It looks like no domains are currently added to this colony. You can add one
      by adding through the input field above.
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
        <Tab>
          <FormattedMessage {...MSG.tabDomains} />
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
              onRemove={console.log}
            />
          ) : (
            <Fragment>
              <Heading
                appearance={{ size: 'small', wight: 'bold', margin: 'small' }}
                text={MSG.labelAdminList}
              />
              <p className={styles.noCurrent}>
                <FormattedMessage {...MSG.noCurrentAdmins} />
              </p>
            </Fragment>
          )}
        </div>
      </TabPanel>
      <TabPanel>
        <OrganizationAddDomains availableAdmins={domainMocks} />
        <div className={styles.domainListWrapper}>
          {/*
            * DomainList follows the design principles from TaskList in dashboard,
            * but if it turns out we're going to use this in multiple places,
            * we should consider moving it to core
            */}
          {domainMocks && domainMocks.length ? (
            <DomainList
              domains={domainMocks}
              label={MSG.labelAdminList}
              viewOnly={false}
              onRemove={console.log}
            />
          ) : (
            <Fragment>
              <Heading
                appearance={{ size: 'small', wight: 'bold', margin: 'small' }}
                text={MSG.labelAdminList}
              />
              <p className={styles.noCurrent}>
                <FormattedMessage {...MSG.noCurrentDomains} />
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
