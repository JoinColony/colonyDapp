import React, { useState, useCallback, ReactNode } from 'react';

import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styles from './MembersSection.css';

import MembersList from '~core/MembersList';
import {
  Colony,
  useMembersSubscription,
  ColonyWatcher,
  ColonyContributor,
} from '~data/index';

import LoadMoreButton from '~core/LoadMoreButton';

const displayName = 'dashboard.MembersSection';

interface Props<U> {
  title: MessageDescriptor;
  description?: MessageDescriptor;
  colony: Colony;
  currentDomainId: number;
  members: ColonyWatcher[] | ColonyContributor[];
  canAdministerComments: boolean;
  membersListExtraItemContent: (user: U) => ReactNode;
}

const ITEMS_PER_SECTION = 10;
const MembersSection = <U extends ColonyWatcher | ColonyContributor>({
  title,
  description,
  colony: { colonyAddress },
  colony,
  currentDomainId,
  members,
  canAdministerComments,
  membersListExtraItemContent,
}: // @NOTE Add another optional paramater called sortingParams/sortingFun to handle sorting
Props<U>) => {
  const [dataSection, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, ITEMS_PER_SECTION * dataSection);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataSection + 1);
  }, [dataSection]);

  const { loading: loadingAllMembers } = useMembersSubscription({
    variables: {
      colonyAddress,
    },
  });

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.title}>
          <FormattedMessage {...title} />
        </div>
        {description && (
          <div className={styles.description}>
            <FormattedMessage {...description} />
          </div>
        )}
      </div>
      <MembersList
        colony={colony}
        extraItemContent={membersListExtraItemContent}
        domainId={currentDomainId}
        users={paginatedMembers}
        canAdministerComments={canAdministerComments}
      />
      {ITEMS_PER_SECTION * dataSection < members.length && (
        <LoadMoreButton
          onClick={handleDataPagination}
          isLoadingData={loadingAllMembers}
        />
      )}
    </>
  );
};

MembersSection.displayName = displayName;

export default MembersSection;
