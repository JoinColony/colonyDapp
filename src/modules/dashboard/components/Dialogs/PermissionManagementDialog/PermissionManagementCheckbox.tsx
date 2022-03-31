import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Checkbox } from '~core/Fields';
import PermissionsLabel from '~core/PermissionsLabel';

import styles from './PermissionManagementCheckbox.css';

const MSG = defineMessages({
  roleWithAsterisk: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleWithAsterisk`,
    defaultMessage: '{role}{asterisk, select, true {*} false {} }',
  },
  roleDescription0: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleDescription0`,
    defaultMessage: `Disable colony in emergency, update storage, and approve reactivation.`,
  },
  roleDescription1: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleDescription1`,
    defaultMessage: 'Take actions effecting the colony as a whole.',
  },
  roleDescription2: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleDescription2`,
    defaultMessage: `Arbitration allows you to resolve disputes, make state changes, and punish bad behavior.`,
  },
  roleDescription3: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleDescription3`,
    defaultMessage: 'Create teams and manage permissions in sub-teams.',
  },
  // We don't have architecture_subdomain (which would be 4)
  roleDescription5: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleDescription5`,
    defaultMessage: 'Fund expenditures and transfer funds between teams.',
  },
  roleDescription6: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.roleDescription6`,
    defaultMessage: 'Create and manage expenditures.',
  },
  tooltipNoPermissionsText: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.tooltipNoPermissionsText`,
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
  tooltipNoRootDomainSelected: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementCheckbox.tooltipNoRootDomainSelected`,
    defaultMessage: 'Switch team to Root to set the root role.',
  },
});

interface Props {
  asterisk: boolean;
  disabled: boolean;
  role: ColonyRole;
  domainId: number;
  dataTest: string;
}

const displayName =
  'dashboard.PermissionManagementDialog.PermissionManagementCheckbox';

const PermissionManagementCheckbox = ({
  asterisk,
  disabled,
  role,
  domainId,
  dataTest,
}: Props) => {
  const roleNameMessage = { id: `role.${role}` };
  const roleDescriptionMessage = useMemo(
    () =>
      MSG[`roleDescription${role}`] || {
        id: '',
        defaultMessage: '',
      },
    [role],
  );

  const { formatMessage } = useIntl();

  const formattedRole = formatMessage(roleNameMessage);

  const tooltipText =
    domainId !== ROOT_DOMAIN_ID && formattedRole === 'Root'
      ? MSG.tooltipNoRootDomainSelected
      : MSG.tooltipNoPermissionsText;

  const formattedTooltipText = formatMessage(tooltipText, {
    roleName: formattedRole.toLowerCase(),
  });

  return (
    <Checkbox
      className={styles.permissionChoice}
      value={role}
      name="roles"
      disabled={disabled}
      tooltipText={formattedTooltipText}
      tooltipPopperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 12],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 14,
            },
          },
        ],
      }}
      dataTest={dataTest}
    >
      <span className={styles.permissionChoiceDescription}>
        <PermissionsLabel
          permission={role}
          name={formattedRole}
          inherited={asterisk}
        />
        <FormattedMessage {...roleDescriptionMessage} />
      </span>
    </Checkbox>
  );
};

PermissionManagementCheckbox.displayName = displayName;

export default PermissionManagementCheckbox;
