import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { DomainType } from '~immutable/index';
import { ActionTypes } from '~redux/index';

import { useDataFetcher, useOldRoles } from '~utils/hooks';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';
import { domainsFetcher } from '../../../dashboard/fetchers';

import UserList from '../UserList';
import OrganizationAddAdmins from './OrganizationAddAdmins';

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
  labelAdminList: {
    id: 'admin.Organizations.labelAdminList',
    defaultMessage: 'Users',
  },
  noCurrentAdmins: {
    id: 'admin.Organizations.noCurrentAdmins',
    defaultMessage: `
      It looks like no admins are currently added to this colony.
      You can add one by selecting it from the list above.
    `,
  },
});

const displayName = 'admin.Organizations';

interface Props {
  colonyAddress: Address;
}

const Organizations = ({ colonyAddress }: Props) => {
  const { data: roles } = useOldRoles(colonyAddress);

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
        </TabList>
        <TabPanel>
          <div>
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
                  remove={ActionTypes.COLONY_ADMIN_REMOVE}
                  removeSuccess={ActionTypes.COLONY_ADMIN_REMOVE_SUCCESS}
                  removeError={ActionTypes.COLONY_ADMIN_REMOVE_ERROR}
                />
              ) : (
                <>
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
                </>
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
