import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { ColonyRoles } from '~types/roles';
import { Address } from '~types/strings';
import { useSelector } from '~utils/hooks';
import { inheritedRolesSelector } from '../../../dashboard/selectors';
import { ROLE_MESSAGES } from '../../constants';

import styles from './UserPermissions.css';

interface Props {
  colonyAddress: Address;
  domainId: string;
  userAddress: Address;
}

const displayName = 'admin.Permissions.UserPermissions';

const UserPermissions = ({ colonyAddress, domainId, userAddress }: Props) => {
  const roles: Set<ColonyRoles> = useSelector(inheritedRolesSelector, [
    colonyAddress,
    domainId,
    userAddress,
  ]);

  const sortedRoles: ColonyRoles[] = useMemo(
    () =>
      [...roles]
        .filter(
          role =>
            // Don't display ARCHITECTURE_SUBDOMAIN in listed roles
            role !== ColonyRoles.ARCHITECTURE_SUBDOMAIN,
        )
        .sort((a, b) => {
          if (a === ColonyRoles.ROOT || b === ColonyRoles.ROOT) {
            return a === ColonyRoles.ROOT ? 1 : -1;
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
