import React, { useState, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import MembersList from '~core/MembersList';
import LoadMoreButton from '~core/LoadMoreButton';
import SortingRow from '~core/MembersList/SortingRow';
import { Colony, ColonyWatcher, ColonyContributor } from '~data/index';
import useColonyMembersSorting from '~modules/dashboard/hooks/useColonyMembersSorting';

import styles from './MembersSection.css';

const displayName = 'dashboard.MembersSection';

const MSG = defineMessages({
  contributorsTitle: {
    id: 'dashboard.Members.MembersSection.contributorsTitle',
    defaultMessage: 'Contributors',
  },
  watchersTitle: {
    id: 'dashboard.Members.MembersSection.watchersTitle',
    defaultMessage: 'Watchers',
  },
  watchersDescription: {
    id: 'dashboard.Members.MembersSection.watchersDescription',
    defaultMessage: "Members who don't currently have any reputation",
  },
  noMemebersFound: {
    id: 'dashboard.Members.MembersSection.noResultsFound',
    defaultMessage: 'No members found',
  },
});

interface Props<U> {
  isContributorsSection: boolean;
  colony: Colony;
  currentDomainId: number;
  members: ColonyWatcher[] | ColonyContributor[];
  canAdministerComments: boolean;
  extraItemContent: (user: U) => ReactNode;
  itemsPerSection?: number;
}

const MembersSection = <U extends ColonyWatcher | ColonyContributor>({
  colony,
  currentDomainId,
  members,
  canAdministerComments,
  extraItemContent,
  isContributorsSection,
  itemsPerSection = 10,
}: Props<U>) => {
  const [dataPage, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, itemsPerSection * dataPage);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  const {
    sortedMembers,
    sortingMethod,
    handleSortingMethodChange,
  } = useColonyMembersSorting(paginatedMembers, isContributorsSection);

  return (
    <>
      <div className={styles.bar}>
        <div
          className={classnames(styles.title, {
            [styles.contributorsTitle]: isContributorsSection,
          })}
        >
          <FormattedMessage
            {...(isContributorsSection
              ? MSG.contributorsTitle
              : MSG.watchersTitle)}
          />
          {isContributorsSection && handleSortingMethodChange && (
            <SortingRow
              handleSortingMethodChange={handleSortingMethodChange}
              sortingMethod={sortingMethod}
            />
          )}
        </div>
        {!isContributorsSection && (
          <div className={styles.description}>
            <FormattedMessage {...MSG.watchersDescription} />
          </div>
        )}
      </div>
      {sortedMembers.length ? (
        <div className={styles.membersList}>
          <MembersList
            colony={colony}
            extraItemContent={extraItemContent}
            domainId={currentDomainId}
            users={sortedMembers}
            canAdministerComments={canAdministerComments}
            showUserReputation={isContributorsSection}
          />
        </div>
      ) : (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMemebersFound} />
        </div>
      )}
      {itemsPerSection * dataPage < members.length && (
        <LoadMoreButton onClick={handleDataPagination} isLoadingData={false} />
      )}
    </>
  );
};

MembersSection.displayName = displayName;

export default MembersSection;
