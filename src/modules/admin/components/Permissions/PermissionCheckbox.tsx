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
  roleDescriptionRoot: {
    id: 'core.ColonyPermissionEditDialog.roleDescriptionRoot',
    defaultMessage:
      'The highest permission, control all aspects of running a colony.',
  },
  roleDescriptionAdministration: {
    id: 'core.ColonyPermissionEditDialog.roleDescriptionAdministration',
    defaultMessage: 'Create and manage new tasks.',
  },
  roleDescriptionArchitecture: {
    id: 'core.ColonyPermissionEditDialog.roleDescriptionArchitecture',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Set the administration, funding, and architecture roles in any subdomain.',
  },
  roleDescriptionFunding: {
    id: 'core.ColonyPermissionEditDialog.roleDescriptionFunding',
    defaultMessage: 'Fund tasks and transfer funds between domains.',
  },
  roleDescriptionRecovery: {
    id: 'core.ColonyPermissionEditDialog.roleDescriptionRecovery',
    defaultMessage: 'Put the Colony into recovery mode.',
  },
  roleDescriptionArbitration: {
    id: 'core.ColonyPermissionEditDialog.roleDescriptionArbitration',
    defaultMessage: 'Coming soon...',
  },
  tooltipNoPermissionsText: {
    id: 'core.Permissions.PermissionCheckbox.tooltipNoPermissionsText',
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
});

interface Props {
  disabled: boolean;
  intl: IntlShape;
  role: string;
}

const displayName = 'admin.Permissions.PermissionCheckbox';

const PermissionCheckbox = ({
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
            text={roleNameMessage}
            appearance={{ size: 'small', margin: 'none' }}
          />
          <FormattedMessage {...roleDescriptionMessage} />
        </span>
      </Checkbox>
    ),
    [disabled, role, roleDescriptionMessage, roleNameMessage],
  );
  return disabled ? (
    <Popover
      // Note: `placement` must be set in both `appearance` & `placement` prop
      // @todo Cleanup `Popover` placement styles
      // @body `react-popper` uses the `placement` prop, while our styles uses `appearance.placement`. Let's consolidate this into one or the other.
      appearance={{ placement: 'bottom', theme: 'dark' }}
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
