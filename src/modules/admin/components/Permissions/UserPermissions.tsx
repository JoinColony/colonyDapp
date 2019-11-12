import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ROLES } from '~constants';

import { ROLE_MESSAGES } from '../../constants';

import styles from './UserPermissions.css';

interface Props {
  roles: ROLES[];
  directRoles: ROLES[];
}

const displayName = 'admin.Permissions.UserPermissions';

const UserPermissions = ({ roles, directRoles }: Props) => {
  const sortedRoles = roles
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
    });

  return (
    <div className={styles.main}>
      {sortedRoles.map(role => (
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
