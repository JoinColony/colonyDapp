/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';
import type { DomainType, RolesType } from '~immutable';

import { ACTIONS } from '~redux';
import { useDataFetcher } from '~utils/hooks';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import { rolesFetcher, domainsFetcher } from '../../../dashboard/fetchers';

import UserList from '../UserList';
import DomainList from '../DomainList';
import OrganizationAddAdmins from './OrganizationAddAdmins.jsx';
import OrganizationAddDomains from './OrganizationAddDomains.jsx';

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
  labelAdminList: {
    id: 'admin.Organizations.labelAdminList',
    defaultMessage: 'Name',
  },
  labelDomainList: {
    id: 'admin.Organizations.labelDomainList',
    defaultMessage: 'Name',
  },
  noCurrentAdmins: {
    id: 'admin.Organizations.noCurrentAdmins',
    defaultMessage: `
      It looks like no admins are currently added to this colony.
      You can add one by selecting it from the list above.
    `,
  },
  noCurrentDomains: {
    id: 'admin.Organizations.noCurrentDomains',
    defaultMessage: `
      It looks like no domains are currently added to this colony.
      You can add one by adding through the input field above.
    `,
  },
});

const displayName: string = 'admin.Organizations';

type Props = {|
  colonyAddress: Address,
|};

const Organizations = ({ colonyAddress }: Props) => {
  const { data: roles } = useDataFetcher<RolesType>(
    rolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  if (!domains || !roles) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  const { admins } = roles;
  return (
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
          <div className={styles.sectionWrapper}>
            <OrganizationAddAdmins
              /*
               * @todo Add *real* user data
               * Once we have a way to _discover_ users that interacted with the current colony,
               * and which can be made admins
               */
              colonyAddress={colonyAddress}
            />
            <section className={styles.list}>
              {/*
               * UserList follows the design principles from TaskList in dashboard,
               * but if it turns out we're going to use this in multiple places,
               * we should consider moving it to core
               */}
              {admins && admins.length ? (
                <UserList
                  users={admins}
                  label={MSG.labelAdminList}
                  colonyAddress={colonyAddress}
                  showDisplayName
                  showUsername
                  showMaskedAddress
                  viewOnly={false}
                  remove={ACTIONS.COLONY_ADMIN_REMOVE}
                  removeSuccess={ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS}
                  removeError={ACTIONS.COLONY_ADMIN_REMOVE_ERROR}
                />
              ) : (
                <Fragment>
                  <Heading
                    appearance={{
                      size: 'small',
                      weight: 'bold',
                      margin: 'small',
                    }}
                    text={MSG.labelAdminList}
                  />
                  <p className={styles.noCurrent}>
                    <FormattedMessage {...MSG.noCurrentAdmins} />
                  </p>
                </Fragment>
              )}
            </section>
          </div>
        </TabPanel>
        <TabPanel>
          <div className={styles.sectionWrapper}>
            <OrganizationAddDomains colonyAddress={colonyAddress} />
            <section className={styles.list}>
              {/*
               * DomainList follows the design principles from TaskList in dashboard,
               * but if it turns out we're going to use this in multiple places,
               * we should consider moving it to core
               */}
              {domains && domains.length ? (
                <DomainList
                  domains={domains}
                  label={MSG.labelAdminList}
                  // eslint-disable-next-line no-console
                  onRemove={console.log}
                />
              ) : (
                <Fragment>
                  <Heading
                    appearance={{
                      size: 'small',
                      weight: 'bold',
                      margin: 'small',
                    }}
                    text={MSG.labelAdminList}
                  />
                  <p className={styles.noCurrent}>
                    <FormattedMessage {...MSG.noCurrentDomains} />
                  </p>
                </Fragment>
              )}
            </section>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

Organizations.displayName = displayName;

export default Organizations;
