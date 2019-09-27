import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  injectIntl,
  IntlShape,
  MessageDescriptor,
} from 'react-intl';

import { Checkbox } from '~core/Fields';
import Heading from '~core/Heading';
import Popover from '~core/Popover';

import styles from './PermissionCheckbox.css';

const MSG = defineMessages({
  tooltipNoPermissionsText: {
    id: 'core.Permissions.PermissionCheckbox.tooltipNoPermissionsText',
    defaultMessage: 'You do not have permission to set the {roleName} role.',
  },
});

interface Props {
  disabled: boolean;
  intl: IntlShape;
  role: string;
  roleDescription: MessageDescriptor;
}

const displayName = 'admin.Permissions.PermissionCheckbox';

const PermissionCheckbox = ({
  disabled,
  intl: { formatMessage },
  role,
  roleDescription,
}: Props) => {
  const roleNameMessage = { id: `role.${role.toLowerCase()}` };
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
          <FormattedMessage {...roleDescription} />
        </span>
      </Checkbox>
    ),
    [disabled, role, roleDescription, roleNameMessage],
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
