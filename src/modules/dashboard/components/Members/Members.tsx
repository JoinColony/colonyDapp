import React, { FC, useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import MembersList from '~core/MembersList';
import { SpinnerLoader } from '~core/Preloaders';
import LoadMoreButton from '~core/LoadMoreButton';
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
const ITEMS_PER_PAGE = 1;
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
  const [watchersConsidered, setWatchersConsidered] = useState<boolean>(true);
  const [dataPage, setDataPage] = useState<number>(10);
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

  useEffect(() => {
    setWatchersConsidered(
      currentDomainId === ROOT_DOMAIN_ID ||
        currentDomainId === COLONY_TOTAL_BALANCE_DOMAIN_ID,
    );
  }, [currentDomainId]);

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
      const filteredContributors = filterMembers(
        members?.contributorsAndWatchers?.contributors || [],
        filterValue,
      );
      setContributors(filteredContributors);

      const filteredWatchers = filterMembers(
        members?.contributorsAndWatchers?.watchers || [],
        filterValue,
      );
      setWatchers(filteredWatchers);
    },
    [members],
  );

  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  // handles search values & close button
  const handleSearch = useCallback(
    (event) => {
      const value = event.target?.value || '';
      setSearchValue(value);
      filterContributorsAndWatchers(value);
    },
    [filterContributorsAndWatchers, setSearchValue],
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

  /*
   * @NOTE Poor man's pagination
   *
   * We're not really doing proper pagination like we do for say... `ColonyEvents`,
   * because our metadata server doesn't support skip, first, more, next, etc...
   * query filters
   *
   * A proper solution for this would be to teach the server to return just part
   * of the results, with the next waiting in line for a callback, but the current
   * timeframe doesn't allow for this, so I guess this is the "best" we can do for now
   */
  const paginatedContributors =
    contributors?.slice(0, ITEMS_PER_PAGE * dataPage) || [];

  const paginatedWatchers = watchers?.slice(0, ITEMS_PER_PAGE * dataPage) || [];

  const zeroResultsMsg = (isSearchResult: boolean) => {
    const resultMsg = isSearchResult ? MSG.noMemebersFound : MSG.failedToFetch;
    return (
      <div className={styles.noResults}>
        <FormattedMessage {...resultMsg} />
      </div>
    );
  };

  const hasNoMembers = () => {
    if (!contributors?.length && !watchers?.length) {
      return zeroResultsMsg(!!searchValue);
    }
    return null;
  };

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
      <div>
        {/* This needs attention!!!! - ready to be refactored in another PR
        Either display no member message OR show contributors & watchers
        components. - dan */}
        {hasNoMembers()}
        {/* PLACEHOLDER */}
        <div>CONTRIBUTORS</div>
        {contributors?.length ? (
          <MembersList<ColonyContributor>
            colony={colony}
            extraItemContent={({ roles, directRoles, banned }) => (
              <UserPermissions
                roles={roles}
                directRoles={directRoles}
                banned={banned}
              />
            )}
            domainId={currentDomainId}
            users={paginatedContributors}
            canAdministerComments={canAdministerComments}
          />
        ) : (
          watchers?.length && zeroResultsMsg(!!searchValue)
        )}

        {ITEMS_PER_PAGE * dataPage < contributors?.length && (
          <LoadMoreButton
            onClick={handleDataPagination}
            isLoadingData={loadingMembers}
          />
        )}
        {watchersConsidered && (
          <>
            {/* PLACEHOLDER */}
            <div>WATCHERS</div>
            {watchers?.length ? (
              <MembersList<ColonyWatcher>
                colony={colony}
                domainId={currentDomainId}
                users={paginatedWatchers}
                canAdministerComments={canAdministerComments}
                extraItemContent={({ banned }) => (
                  <UserPermissions
                    roles={[]}
                    directRoles={[]}
                    banned={banned}
                  />
                )}
              />
            ) : (
              contributors?.length && zeroResultsMsg(!!searchValue)
            )}

            {ITEMS_PER_PAGE * dataPage < watchers?.length && (
              <LoadMoreButton
                onClick={handleDataPagination}
                isLoadingData={loadingMembers}
              />
            )}
          </>
        )}
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
