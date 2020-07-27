import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { Checkbox } from '~core/Fields';
import Heading from '~core/Heading';
import Popover from '~core/Popover';

import styles from './PermissionCheckbox.css';

const MSG = defineMessages({
  roleWithAsterisk: {
    id: 'admin.ColonyPermissionEditDialog.roleWithAsterisk',
    defaultMessage: '{role}{asterisk, select, true {*} false {} }',
  },
  roleDescription0: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionRecovery',
    defaultMessage: 'Put the Colony into recovery mode.',
  },
  roleDescription1: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionRoot',
    defaultMessage:
      'The highest permission, control all aspects of running a colony.',
  },
  roleDescription2: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionArbitration',
    defaultMessage: 'Coming soon...',
  },
  roleDescription3: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionArchitecture',
    defaultMessage: `Set the administration, funding, and architecture roles in any subdomain.`,
  },
  // We don't have architecture_subdomain (which would be 4)
  roleDescription5: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionFunding',
    defaultMessage: 'Fund tasks and transfer funds between domains.',
  },
  roleDescription6: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionAdministration',
    defaultMessage: 'Create and manage new tasks.',
  },
  tooltipNoPermissionsText: {
    id: 'admin.Permissions.PermissionCheckbox.tooltipNoPermissionsText',
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
});

interface Props {
  asterisk: boolean;
  disabled: boolean;
  role: ColonyRole;
}

const displayName = 'admin.Permissions.PermissionCheckbox';

const PermissionCheckbox = ({ asterisk, disabled, role }: Props) => {
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

  const checkboxContent = useMemo(
    () => (
      <Checkbox
        className={styles.permissionChoice}
        value={role}
        name="roles"
        disabled={disabled}
      >
        <span className={styles.permissionChoiceDescription}>
          <Heading
            text={MSG.roleWithAsterisk}
            textValues={{
              role: formatMessage(roleNameMessage),
              asterisk: !!asterisk,
            }}
            appearance={{ size: 'small', margin: 'none' }}
          />
          <FormattedMessage {...roleDescriptionMessage} />
        </span>
      </Checkbox>
    ),
    [
      asterisk,
      disabled,
      formatMessage,
      role,
      roleDescriptionMessage,
      roleNameMessage,
    ],
  );

  return disabled ? (
    <Popover
      appearance={{ theme: 'dark' }}
      content={() => (
        <div className={styles.popoverContent}>
          <FormattedMessage
            {...MSG.tooltipNoPermissionsText}
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

PermissionCheckbox.displayName = displayName;

export default PermissionCheckbox;
