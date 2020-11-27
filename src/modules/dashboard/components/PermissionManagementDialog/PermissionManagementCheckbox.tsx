import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Checkbox } from '~core/Fields';
import Popover from '~core/Popover';
import PermissionsLabel from '~core/PermissionsLabel';

import styles from './PermissionManagementCheckbox.css';

const idBase =
  'dashboard.PermissionManagementDialog.PermissionManagementCheckbox';

const MSG = defineMessages({
  roleWithAsterisk: {
    id: `${idBase}.roleWithAsterisk`,
    defaultMessage: '{role}{asterisk, select, true {*} false {} }',
  },
  roleDescription0: {
    id: `${idBase}.roleDescriptionRecovery`,
    defaultMessage:
      'Disable colony in emergency, update storage, and approvee reactivation',
  },
  roleDescription1: {
    id: `${idBase}.roleDescriptionRoot`,
    defaultMessage: 'Take actions effecting the colony as a whole.',
  },
  roleDescription2: {
    id: `${idBase}.roleDescriptionArbitration`,
    defaultMessage: 'Coming soon...',
  },
  roleDescription3: {
    id: `${idBase}.roleDescriptionArchitecture`,
    defaultMessage: `Set permissions in the active domain, and any subdomain.`,
  },
  // We don't have architecture_subdomain (which would be 4)
  roleDescription5: {
    id: `${idBase}.roleDescriptionFunding`,
    defaultMessage: 'Fund expenditures and transfer funds between domains.',
  },
  roleDescription6: {
    id: `${idBase}.roleDescriptionAdministration`,
    defaultMessage: 'Create and manage expenditures.',
  },
  tooltipNoPermissionsText: {
    id: `${idBase}.tooltipNoPermissionsText`,
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
  tooltipNoRootDomainSelected: {
    id: `${idBase}.tooltipNoRootDomainSelected`,
    defaultMessage: 'Switch domain to #Root to set the root role.',
  },
});

interface Props {
  asterisk: boolean;
  disabled: boolean;
  role: ColonyRole;
  domainId: number;
}

const displayName = 'admin.Permissions.PermissionCheckbox';

const PermissionManagementCheckbox = ({
  asterisk,
  disabled,
  role,
  domainId,
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

  const checkboxContent = useMemo(
    () => (
      <Checkbox
        className={styles.permissionChoice}
        value={role}
        name="roles"
        disabled={disabled}
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
    ),
    [asterisk, disabled, role, roleDescriptionMessage, formattedRole],
  );

  const tooltipText =
    domainId !== ROOT_DOMAIN_ID && formattedRole === 'Root'
      ? MSG.tooltipNoRootDomainSelected
      : MSG.tooltipNoPermissionsText;

  return disabled ? (
    <Popover
      appearance={{ theme: 'dark' }}
      content={() => (
        <div className={styles.popoverContent}>
          <FormattedMessage
            {...tooltipText}
            values={{ roleName: formatMessage(roleNameMessage).toLowerCase() }}
          />
        </div>
      )}
      placement="bottom"
    >
      {({ close, open, ref }) => (
        <div ref={ref} onMouseEnter={open} onMouseLeave={close}>
          {checkboxContent}
        </div>
      )}
    </Popover>
  ) : (
    <>{checkboxContent}</>
  );
};

PermissionManagementCheckbox.displayName = displayName;

export default PermissionManagementCheckbox;
