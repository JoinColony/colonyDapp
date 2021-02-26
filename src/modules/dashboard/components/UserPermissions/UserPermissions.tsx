import React from 'react';
import { ColonyRole } from '@colony/colony-js';
import { isNil } from 'lodash';

import PermissionsLabel from '~core/PermissionsLabel';
import { permissionsObject } from '~core/PermissionsLabel/permissions';
import { getMainClasses } from '~utils/css';

import styles from './UserPermissions.css';

interface Appearance {
  padding: 'none';
}

interface Props {
  roles: ColonyRole[];
  directRoles: ColonyRole[];
  appearance?: Appearance;
}

const displayName = 'dashboard.UserPermissions';

const UserPermissions = ({ roles, directRoles, appearance }: Props) => {
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
  const [headRole, ...restRoles] = sortedRoles;
  return (
    <div className={getMainClasses(appearance, styles)}>
      {!isNil(headRole) && (
        <PermissionsLabel
          permission={headRole}
          key={headRole}
          inherited={!directRoles.includes(headRole)}
        />
      )}
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
