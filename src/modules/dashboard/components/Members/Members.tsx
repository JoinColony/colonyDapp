import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import { SpinnerLoader } from '~core/Preloaders';
import UserPermissions from '~dashboard/UserPermissions';
import { useTransformer } from '~utils/hooks';
import {
  Colony,
  useLoggedInUser,
  BannedUsersQuery,
  useContributorsAndWatchersQuery,
  ColonyContributor,
  ColonyWatcher,
  DomainFieldsFragment,
  AnyUser,
} from '~data/index';
import {
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
  ALLDOMAINS_DOMAIN_SELECTION,
} from '~constants';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot, canAdminister } from '~modules/users/checks';

import MembersTitle from './MembersTitle';
import { filterMembers } from './filterMembers';
import MembersSection from './MembersSection';

import styles from './Members.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Members.loading',
    defaultMessage: "Loading Colony's users...",
  },
  failedToFetch: {
    id: 'dashboard.Members.failedToFetch',
    defaultMessage: "Could not fetch the colony's members",
  },
  noMemebersFound: {
    id: 'dashboard.Members.noResultsFound',
    defaultMessage: 'No members found',
  },
});

interface Props {
  colony: Colony;
  bannedUsers: BannedUsersQuery['bannedUsers'];
  selectedDomain: DomainFieldsFragment | undefined;
  handleDomainChange: React.Dispatch<React.SetStateAction<number>>;
}

export type Member = AnyUser & {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
  banned: boolean;
};

const displayName = 'dashboard.Members';

const Members = ({
  colony: { colonyAddress, colonyName },
  colony,
  selectedDomain,
  handleDomainChange,
}: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const {
    walletAddress: currentUserWalletAddress,
    username,
    ethereal,
  } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;
  const [contributors, setContributors] = useState<ColonyContributor[]>([]);
  const [watchers, setWatchers] = useState<ColonyWatcher[]>([]);

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

  useEffect(() => {
    setContributors(members?.contributorsAndWatchers?.contributors || []);
    setWatchers(members?.contributorsAndWatchers?.watchers || []);
  }, [members]);

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

  const filterContributorsAndWatchers = useCallback(
    (filterValue) => {
      const filteredContributors = filterMembers<ColonyContributor>(
        members?.contributorsAndWatchers?.contributors || [],
        filterValue,
      );
      setContributors(filteredContributors);

      const filteredWatchers = filterMembers<ColonyWatcher>(
        members?.contributorsAndWatchers?.watchers || [],
        filterValue,
      );
      setWatchers(filteredWatchers);
    },
    [members],
  );

  // handles search values & close button
  const handleSearch = useCallback(
    (event) => {
      const value = event.target?.value || '';
      setSearchValue(value);
      filterContributorsAndWatchers(value);
    },
    [filterContributorsAndWatchers, setSearchValue],
  );

  const membersContent = useMemo(() => {
    const contributorsContent = (
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
    );

    const watchersContent =
      currentDomainId === ROOT_DOMAIN_ID ||
      currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID ? (
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
      ) : null;

    return (
      <>
        {contributorsContent}
        {watchersContent}
      </>
    );
  }, [canAdministerComments, colony, contributors, currentDomainId, watchers]);

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
      <MembersTitle
        currentDomainId={currentDomainId}
        handleDomainChange={handleDomainChange}
        domainSelectOptions={domainSelectOptions}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />
      {!contributors?.length && !watchers?.length ? (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMemebersFound} />
        </div>
      ) : (
        membersContent
      )}
    </div>
  );
};

Members.displayName = displayName;

export default Members as FC<Props>;
