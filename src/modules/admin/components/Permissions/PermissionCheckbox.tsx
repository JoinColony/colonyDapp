import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  IntlShape,
} from 'react-intl';
import camelcase from 'camelcase';

import { Checkbox } from '~core/Fields';
import Heading from '~core/Heading';
import Popover from '~core/Popover';
import { capitalize } from '~utils/strings';

import styles from './PermissionCheckbox.css';

const MSG = defineMessages({
  roleWithAsterisk: {
    id: 'admin.ColonyPermissionEditDialog.roleWithAsterisk',
    defaultMessage: '{role}{asterisk, select, true {*} false {} }',
  },
  roleDescriptionRoot: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionRoot',
    defaultMessage:
      'The highest permission, control all aspects of running a colony.',
  },
  roleDescriptionAdministration: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionAdministration',
    defaultMessage: 'Create and manage new tasks.',
  },
  roleDescriptionArchitecture: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionArchitecture',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Set the administration, funding, and architecture roles in any subdomain.',
  },
  roleDescriptionFunding: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionFunding',
    defaultMessage: 'Fund tasks and transfer funds between domains.',
  },
  roleDescriptionRecovery: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionRecovery',
    defaultMessage: 'Put the Colony into recovery mode.',
  },
  roleDescriptionArbitration: {
    id: 'admin.ColonyPermissionEditDialog.roleDescriptionArbitration',
    defaultMessage: 'Coming soon...',
  },
  tooltipNoPermissionsText: {
    id: 'admin.Permissions.PermissionCheckbox.tooltipNoPermissionsText',
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
});

interface Props {
  asterisk: boolean;
  disabled: boolean;
  intl: IntlShape;
  role: string;
}

const displayName = 'admin.Permissions.PermissionCheckbox';

const PermissionCheckbox = ({
  asterisk,
  disabled,
  intl: { formatMessage },
  role,
}: Props) => {
  const roleNameMessage = { id: `role.${role.toLowerCase()}` };
  const roleDescriptionMessage = useMemo(
    () =>
      MSG[`roleDescription${capitalize(camelcase(role))}`] || {
        id: '',
        defaultMessage: '',
      },
    [role],
  );
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

export default injectIntl(PermissionCheckbox);
