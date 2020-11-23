import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import PermissionsLabel from '~core/PermissionsLabel';
import { permissionsObject } from '~core/PermissionsLabel/permissions';

import styles from './UserPermissions.css';

interface Props {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
}

const displayName = 'admin.Permissions.UserPermissions';

const UserPermissions = ({ roles, directRoles }: Props) => {
  const sortedRoles = roles
    .filter(
      (role) =>
        // Don't display ArchitectureSubdomain role in listed roles
        role !== ColonyRole.ArchitectureSubdomain_DEPRECATED,
    )
    .sort((a, b) => {
      if (a === ColonyRole.Root || b === ColonyRole.Root) {
        return a === ColonyRole.Root ? 1 : -1;
      }
      return 0;
    });
  const [role, ...restRoles] = sortedRoles;
  return (
    <div className={styles.main}>
      <PermissionsLabel
        permission={role}
        key={role}
        inherited={!directRoles.includes(role)}
      />
      {restRoles.map((role) => (
        <PermissionsLabel
          permission={role}
          key={role}
          inherited={!directRoles.includes(role)}
          infoMessage={permissionsObject[role].infoMessage}
          minimal
        />
      ))}
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
