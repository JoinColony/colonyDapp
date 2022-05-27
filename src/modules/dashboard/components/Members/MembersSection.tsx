import React, { useState, useCallback, ReactNode } from 'react';

import { FormattedMessage, defineMessages } from 'react-intl';
import styles from './MembersSection.css';

import MembersList from '~core/MembersList';
import { Colony, ColonyWatcher, ColonyContributor } from '~data/index';

import LoadMoreButton from '~core/LoadMoreButton';

const displayName = 'dashboard.MembersSection';

const MSG = defineMessages({
  contributorsTitle: {
    id: 'dashboard.Members.contributorsTitle',
    defaultMessage: 'Contributors',
  },
  watchersTitle: {
    id: 'dashboard.Members.watchersTitle',
    defaultMessage: 'Watchers',
  },
  watchersDescription: {
    id: 'dashboard.Members.watchersDescription',
    defaultMessage: "Members who don't currently have any reputation",
  },
});

interface Props<U> {
  isContributorsSection: boolean;
  colony: Colony;
  currentDomainId: number;
  members: ColonyWatcher[] | ColonyContributor[];
  canAdministerComments: boolean;
  extraItemContent: (user: U) => ReactNode;
}

const ITEMS_PER_SECTION = 10;
const MembersSection = <U extends ColonyWatcher | ColonyContributor>({
  colony,
  currentDomainId,
  members,
  canAdministerComments,
  extraItemContent,
  isContributorsSection,
}: // @NOTE Add another optional paramater called sortingParams/sortingFun to handle sorting
Props<U>) => {
  const [dataPage, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, ITEMS_PER_SECTION * dataPage);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.title}>
          <FormattedMessage
            {...(isContributorsSection
              ? MSG.contributorsTitle
              : MSG.watchersTitle)}
          />
        </div>
        {!isContributorsSection && (
          <div className={styles.description}>
            <FormattedMessage {...MSG.watchersDescription} />
          </div>
        )}
      </div>
      <MembersList
        colony={colony}
        extraItemContent={extraItemContent}
        domainId={currentDomainId}
        users={paginatedMembers}
        canAdministerComments={canAdministerComments}
      />
      {ITEMS_PER_SECTION * dataPage < members.length && (
        <LoadMoreButton onClick={handleDataPagination} isLoadingData={false} />
      )}
    </>
  );
};

MembersSection.displayName = displayName;

export default MembersSection;