import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  COLONY_ROLE_ROOT,
  COLONY_ROLE_ARCHITECTURE_SUBDOMAIN,
} from '@colony/colony-js-client';

import { Address } from '~types/strings';
import { useUserDomainRoles } from '~utils/hooks';

import { ROLE_MESSAGES } from '../../constants';

import styles from './UserPermissions.css';

interface Props {
  colonyAddress: Address;
  domainId: number;
  userAddress: Address;
}

const displayName = 'admin.Permissions.UserPermissions';

const UserPermissions = ({ colonyAddress, domainId, userAddress }: Props) => {
  const { data: userPermissions } = useUserDomainRoles(
    colonyAddress,
    domainId,
    userAddress,
  );

  const { data: userPermissionsWithParents } = useUserDomainRoles(
    colonyAddress,
    domainId,
    userAddress,
    true,
  );

  const sortedUserPermissionlabels = useMemo(
    () =>
      Object.keys(userPermissionsWithParents)
        .filter(
          key =>
            !!userPermissionsWithParents[key] &&
            // Don't display ARCHITECTURE_SUBDOMAIN in listed roles
            key !== COLONY_ROLE_ARCHITECTURE_SUBDOMAIN,
        )
        .sort((a, b) => {
          if (a === COLONY_ROLE_ROOT || b === COLONY_ROLE_ROOT) {
            return a === COLONY_ROLE_ROOT ? 1 : -1;
          }
          return 0;
        }),
    [userPermissionsWithParents],
  );

  return (
    <div className={styles.main}>
      {userPermissions.pending ? (
        <div className={styles.pendingDot} />
      ) : (
        <>
          {sortedUserPermissionlabels.map(userPermission => (
            <span className={styles.permission} key={userPermission}>
              <FormattedMessage id={ROLE_MESSAGES[userPermission]} />
              {!userPermissions[userPermission] && <span>*</span>}
            </span>
          ))}
        </>
      )}
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
