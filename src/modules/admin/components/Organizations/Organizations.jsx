/* @flow */

import React, { Fragment, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';
import type { DomainType, RolesType, UserPermissionsType } from '~immutable';

import { ACTIONS } from '~redux';
import { pipe, mergePayload, withKey } from '~utils/actions';
import { useDataFetcher, useAsyncFunction } from '~utils/hooks';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import { canAdminister } from '../../../users/checks';
import { rolesFetcher, domainsFetcher } from '../../../dashboard/fetchers';

import { currentUserColonyPermissionsFetcher } from '../../../users/fetchers';

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
    defaultMessage: 'Users',
  },
  labelDomainList: {
    id: 'admin.Organizations.labelDomainList',
    defaultMessage: 'Domains',
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

  const { data: permissions } = useDataFetcher<UserPermissionsType>(
    currentUserColonyPermissionsFetcher,
    [colonyAddress || undefined],
    [colonyAddress || undefined],
  );

  const transform = pipe(
    withKey(colonyAddress),
    mergePayload({ colonyAddress }),
  );

  const editFn = useAsyncFunction({
    submit: ACTIONS.DOMAIN_EDIT,
    success: ACTIONS.DOMAIN_EDIT_SUCCESS,
    error: ACTIONS.DOMAIN_EDIT_ERROR,
    transform,
  });

  const handleEdit = useCallback(
    (domainId: number) => editFn({ domainId }),
    // This is unnecessary because the ref is never changing. The linter isn't smart enough to know that though
    [editFn],
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
                  label={MSG.labelDomainList}
                  viewOnly={!canAdminister(permissions)}
                  onEdit={handleEdit}
                />
              ) : (
                <Fragment>
                  <Heading
                    appearance={{
                      size: 'small',
                      weight: 'bold',
                      margin: 'small',
                    }}
                    text={MSG.labelDomainList}
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
