import React, { useState, useCallback } from 'react';

import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styles from './MembersSection.css';

import MembersList from '~core/MembersList';
import {
  Colony,
  useMembersSubscription,
  ColonyWatcher,
  ColonyContributor,
} from '~data/index';

import UserPermissions from '~dashboard/UserPermissions';
import LoadMoreButton from '~core/LoadMoreButton';

const displayName = 'dashboard.MembersSection';

interface Props {
  title: MessageDescriptor;
  description?: MessageDescriptor;
  colony: Colony;
  currentDomainId: number;
  members: ColonyWatcher[] | ColonyContributor[];
  canAdministerComments: boolean;
}

const ITEMS_PER_SECTION = 10;
const MembersSection = ({
  title,
  description,
  colony: { colonyAddress },
  colony,
  currentDomainId,
  members,
  canAdministerComments,
}: // @NOTE Add another optional paramater called sortingParams/sortingFun to handle sorting
Props) => {
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
  // Runtime type check, the `roles` property only exists in Contributors
  const memberKind = 'roles' in members?.[0] ? 'contributor' : 'watcher';

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
      {memberKind === 'contributor' ? (
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
          users={paginatedMembers as ColonyContributor[]}
          canAdministerComments={canAdministerComments}
        />
      ) : (
        <MembersList<ColonyWatcher>
          colony={colony}
          extraItemContent={({ banned }) => (
            <UserPermissions roles={[]} directRoles={[]} banned={banned} />
          )}
          domainId={currentDomainId}
          users={paginatedMembers as ColonyWatcher[]}
          canAdministerComments={canAdministerComments}
        />
      )}
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
