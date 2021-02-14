import React from 'react';
import { useIntl } from 'react-intl';

import { ActionUserRoles } from '~types/index';
import PermissionsLabel from '~core/PermissionsLabel';

import styles from './DetailsWidgetRoles.css';

const displayName = `dashboard.ActionsPage.DetailsWidget.DetailsWidgetRoles.DetailsWidgetRolesItem`;

interface Props {
  role: ActionUserRoles;
}

const DetailsWidgetRolesItem = ({ role }: Props) => {
  const roleNameMessage = { id: `role.${role.id}` };
  const { formatMessage } = useIntl();
  const formattedRole = formatMessage(roleNameMessage);

  return (
    <li className={styles.roleListItem}>
      <PermissionsLabel permission={role.id} name={formattedRole} />
    </li>
  );
};

DetailsWidgetRolesItem.displayName = displayName;

export default DetailsWidgetRolesItem;
