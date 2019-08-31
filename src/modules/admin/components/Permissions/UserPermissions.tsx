import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import camelcase from 'camelcase';

import { Address } from '~types/strings';
import { useUserDomainRoles } from '~utils/hooks';

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

  const sortedUserPermissionlabels = useMemo(
    () =>
      Object.keys(userPermissions)
        .filter(key => !!userPermissions[key])
        .sort((a, b) => {
          if (a === 'ROOT' || b === 'ROOT') {
            return a === 'ROOT' ? 1 : -1;
          }
          return 0;
        }),
    [userPermissions],
  );

  return (
    <div className={styles.main}>
      {userPermissions.pending ? (
        <div className={styles.pendingDot} />
      ) : (
        <>
          {sortedUserPermissionlabels.map(userPermission => (
            <span className={styles.permission} key={userPermission}>
              <FormattedMessage id={`role.${camelcase(userPermission)}`} />
            </span>
          ))}
        </>
      )}
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
