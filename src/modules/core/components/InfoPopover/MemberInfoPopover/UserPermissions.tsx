import React from 'react';
import { ColonyRole } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import PermissionsLabel from '~core/PermissionsLabel';

import styles from './MemberInfoPopover.css';
import Heading from '~core/Heading';

const displayName = `InfoPopover.MemberInfoPopover.UserPermissions`;

interface Props {
  roles: ColonyRole[];
}

const MSG = defineMessages({
  labelText: {
    id: 'InfoPopover.MemberInfoPopover.UserPermissions.labelText',
    defaultMessage: 'Permissions',
  },
});

const UserPermissions = ({ roles }: Props) => {
  return (
    <div className={styles.sectionContainer}>
      <Heading
        appearance={{
          size: 'normal',
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      <ul className={styles.roleList}>
        {roles.map((role) => (
          <li key={role}>
            <PermissionsLabel permission={role} />
          </li>
        ))}
      </ul>
    </div>
  );
};

UserPermissions.displayName = displayName;

export default UserPermissions;
