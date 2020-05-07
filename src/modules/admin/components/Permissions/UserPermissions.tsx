import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { ROLE_MESSAGES } from '../../constants';

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

  return (
    <div className={styles.main}>
      {sortedRoles.map((role) => (
        <span className={styles.permission} key={role}>
          <FormattedMessage id={ROLE_MESSAGES[role]} />
          {!directRoles.includes(role) ? '*' : null}
        </span>
      ))}
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
