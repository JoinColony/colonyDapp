import React, { FC, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import MembersSection from './MembersSection';

import UserPermissions from '~dashboard/UserPermissions';

import { SpinnerLoader } from '~core/Preloaders';
import Heading from '~core/Heading';
import { Select, Form } from '~core/Fields';
import { useTransformer } from '~utils/hooks';
import {
  Colony,
  useLoggedInUser,
  BannedUsersQuery,
  useContributorsAndWatchersQuery,
  ColonyContributor,
  ColonyWatcher,
  DomainFieldsFragment,
} from '~data/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
} from '~constants';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot, canAdminister } from '~modules/users/checks';

import styles from './Members.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Members.loading',
    defaultMessage: "Loading Colony's users...",
  },
  title: {
    id: 'dashboard.Members.title',
    defaultMessage: `Members:`,
  },
  labelFilter: {
    id: 'dashboard.Members.labelFilter',
    defaultMessage: 'Filter',
  },
  failedToFetch: {
    id: 'dashboard.Members.failedToFetch',
    defaultMessage: "Could not fetch the colony's members",
  },
});

interface Props {
  colony: Colony;
  bannedUsers: BannedUsersQuery['bannedUsers'];
  selectedDomain: DomainFieldsFragment | undefined;
  handleDomainChange: React.Dispatch<React.SetStateAction<number>>;
}

const displayName = 'dashboard.Members';

const Members = ({
  colony: { colonyAddress, colonyName },
  colony,
  selectedDomain,
  handleDomainChange,
}: Props) => {
  const {
    walletAddress: currentUserWalletAddress,
    username,
    ethereal,
  } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;

  /*
   * NOTE If we can't find the domain based on the current selected doamain id,
   * it means that it doesn't exist.
   * We then fall back to the to the "All Domains" selection
   *
   * Another alternative would be to redirect here to the /colony/members route
   * but that has the annoying side-effect of flickering the loading spinner
   * a couple of times on the page
   */
  const { ethDomainId: currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID } =
    selectedDomain || {};

  const {
    data: members,
    loading: loadingMembers,
  } = useContributorsAndWatchersQuery({
    variables: {
      colonyAddress,
      colonyName,
      domainId: currentDomainId,
    },
  });

  const contributors = members?.contributorsAndWatchers?.contributors || [];
  const watchers = members?.contributorsAndWatchers?.watchers || [];

  const currentUserRoles = useTransformer(getAllUserRoles, [
    colony,
    currentUserWalletAddress,
  ]);
  const canAdministerComments =
    hasRegisteredProfile &&
    (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

  const domainSelectOptions = sortBy(
    [...colony.domains, ALLDOMAINS_DOMAIN_SELECTION].map(
      ({ ethDomainId, name }) => ({
        value: ethDomainId.toString(),
        label: name,
      }),
    ),
    ['value'],
  );

  const setFieldValue = useCallback(
    (value) => handleDomainChange(parseInt(value, 10)),
    [handleDomainChange],
  );

  if (loadingMembers) {
    return (
      <div className={styles.main}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ size: 'massive', theme: 'primary' }}
        />
      </div>
    );
  }
  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
        <Form
          initialValues={{ filter: currentDomainId.toString() }}
          onSubmit={() => {}}
        >
          <div className={styles.titleSelect}>
            <Select
              appearance={{
                alignOptions: 'right',
                size: 'mediumLarge',
                theme: 'alt',
              }}
              elementOnly
              label={MSG.labelFilter}
              name="filter"
              onChange={setFieldValue}
              options={domainSelectOptions}
            />
          </div>
        </Form>
      </div>
      {contributors.length ? (
        <MembersSection<ColonyContributor>
          isContributorsSection
          colony={colony}
          currentDomainId={currentDomainId}
          members={contributors as ColonyContributor[]}
          canAdministerComments={canAdministerComments}
          extraItemContent={({ roles, directRoles, banned }) => {
            return (
              <UserPermissions
                roles={roles}
                directRoles={directRoles}
                banned={banned}
              />
            );
          }}
        />
      ) : (
        <FormattedMessage {...MSG.failedToFetch} />
      )}
      {(currentDomainId === ROOT_DOMAIN_ID ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) && (
        <>
          {watchers?.length && (
            <MembersSection<ColonyWatcher>
              isContributorsSection={false}
              colony={colony}
              currentDomainId={currentDomainId}
              members={watchers as ColonyWatcher[]}
              canAdministerComments={canAdministerComments}
              extraItemContent={({ banned }) => (
                <UserPermissions roles={[]} directRoles={[]} banned={banned} />
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
