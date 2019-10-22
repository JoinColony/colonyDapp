import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { ROLES } from '~constants';
import { Address } from '~types/strings';
import { useDataFetcher } from '~utils/hooks';

import { domainsAndRolesFetcher } from '../../../dashboard/fetchers';
import { getInheritedRoles } from '../../../users/checks';
import { ROLE_MESSAGES } from '../../constants';

import styles from './UserPermissions.css';

interface Props {
  colonyAddress: Address;
  domainId: number;
  userAddress: Address;
}

const displayName = 'admin.Permissions.UserPermissions';

const UserPermissions = ({ colonyAddress, domainId, userAddress }: Props) => {
  const { data: domains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const roles = getInheritedRoles(domains, domainId, userAddress);

  const sortedRoles: ROLES[] = useMemo(
    () =>
      roles
        .filter(
          role =>
            // Don't display ARCHITECTURE_SUBDOMAIN in listed roles
            role !== ROLES.ARCHITECTURE_SUBDOMAIN,
        )
        .sort((a, b) => {
          if (a === ROLES.ROOT || b === ROLES.ROOT) {
            return a === ROLES.ROOT ? 1 : -1;
          }
          return 0;
        }),
    [roles],
  );

  return (
    <div className={styles.main}>
      {/* @TODO restore pending role indicator */}
      {/* {userPermissions.pending ? ( */}
      {/*  <div className={styles.pendingDot} /> */}
      {sortedRoles.map(role => (
        <span className={styles.permission} key={role}>
          <FormattedMessage id={ROLE_MESSAGES[role]} />
        </span>
      ))}
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
