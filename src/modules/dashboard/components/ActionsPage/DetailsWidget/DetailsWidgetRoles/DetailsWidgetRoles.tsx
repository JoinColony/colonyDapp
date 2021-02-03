import React from 'react';

import { ActionUserRoles } from '~types/index';

import DetailsWidgetRolesItem from './DetailsWidgetRolesItem';
import styles from './DetailsWidgetRoles.css';

const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetRoles';

interface Props {
  roles: ActionUserRoles[];
}

const DetailsWidgetRoles = ({ roles }: Props) => (
  <ul className={styles.roleList}>
    {roles.map((role) => (
      <DetailsWidgetRolesItem key={role.id} role={role} />
    ))}
  </ul>
);

DetailsWidgetRoles.displayName = displayName;

export default DetailsWidgetRoles;
