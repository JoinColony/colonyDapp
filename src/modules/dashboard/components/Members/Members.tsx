import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import { SpinnerLoader } from '~core/Preloaders';
import UserPermissions from '~dashboard/UserPermissions';
import {
  FormValues as FiltersFormValues,
  MemberType,
} from '~dashboard/ColonyMembers/MembersFilter';

import { useTransformer } from '~utils/hooks';
import {
  Colony,
  useLoggedInUser,
  useContributorsAndWatchersQuery,
  ColonyContributor,
  ColonyWatcher,
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
  selectedDomain: number | undefined;
  handleDomainChange: React.Dispatch<React.SetStateAction<number>>;
  filters: FiltersFormValues;
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
  filters,
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

  const {
    data: members,
    loading: loadingMembers,
  } = useContributorsAndWatchersQuery({
    variables: {
      colonyAddress,
      colonyName,
      domainId: selectedDomain,
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

  const filterContributorsAndWatchers = useCallback(() => {
    const filteredContributors = filterMembers<ColonyContributor>(
      members?.contributorsAndWatchers?.contributors || [],
      searchValue,
      filters,
    );
    setContributors(filteredContributors);

    const filteredWatchers = filterMembers<ColonyWatcher>(
      members?.contributorsAndWatchers?.watchers || [],
      searchValue,
      filters,
    );
    setWatchers(filteredWatchers);
  }, [members, filters, searchValue]);

  // handles search values & close button
  const handleSearch = useCallback(
    (event) => {
      const value = event.target?.value || '';
      setSearchValue(value);
      filterContributorsAndWatchers();
    },
    [filterContributorsAndWatchers, setSearchValue],
  );

  const isRootDomain = useMemo(
    () =>
      selectedDomain === ROOT_DOMAIN_ID ||
      selectedDomain === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    [selectedDomain],
  );

  const membersContent = useMemo(() => {
    const contributorsContent = (!isRootDomain ||
      filters.memberType === MemberType.ALL ||
      filters.memberType === MemberType.CONTRIBUTORS) && (
      <MembersSection<ColonyContributor>
        isContributorsSection
        colony={colony}
        currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
        members={contributors as ColonyContributor[]}
        canAdministerComments={canAdministerComments}
        extraItemContent={({ roles, directRoles, banned }) => {
          return (
            <UserPermissions
              roles={roles}
              directRoles={directRoles}
              banned={banned}
              hideHeadRole
            />
          );
        }}
      />
    );

    const watchersContent =
      isRootDomain &&
      (filters.memberType === MemberType.ALL ||
        filters.memberType === MemberType.WATCHERS) ? (
        <MembersSection<ColonyWatcher>
          isContributorsSection={false}
          colony={colony}
          currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
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
  }, [
    canAdministerComments,
    colony,
    contributors,
    selectedDomain,
    watchers,
    filters,
    isRootDomain,
  ]);

  useEffect(() => {
    filterContributorsAndWatchers();
  }, [filterContributorsAndWatchers, filters, isRootDomain]);

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
        currentDomainId={selectedDomain || COLONY_TOTAL_BALANCE_DOMAIN_ID}
        handleDomainChange={handleDomainChange}
        domainSelectOptions={domainSelectOptions}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
        colony={colony}
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
