import React from 'react';

import { MessageDescriptor, useIntl } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import Icon from '~core/Icon';
import { Tooltip } from '../Popover';
import styles from './PermissionsLabel.css';
import { permissionsObject } from './permissions';

interface Props {
  /** Permission name */
  permission: ColonyRole;

  /** Icon name for permission label. If empy, default will be taken from permission object */
  icon?: string;

  /** Whether or not the permission is inherited. If `true`, will add * asterisk to permission name. */
  inherited?: boolean;

  /** Permission name. If empty, default will be taken from permissions object */
  name?: MessageDescriptor | string;

  /** Optional info message about permission being inherited. */
  infoMessage?: MessageDescriptor | string;

  /** Where or not we should show only icon or icon with title */
  /** We could consider implement it with Appearance object, but i feel its not yet time for it */
  minimal?: boolean;
}

const displayName = 'PermissionsLabel';

const PermissionsLabel = ({
  permission,
  icon,
  inherited = false,
  name,
  infoMessage,
  minimal = false,
}: Props) => {
  const { formatMessage } = useIntl();
  const permissionDefaults = permissionsObject[permission];
  const permissionName = name || permissionDefaults.label;
  const permissionIcon = icon || permissionDefaults.icon;

  const translatedName =
    typeof permissionName === 'string'
      ? permissionName
      : formatMessage(permissionName);
  const tooltipText =
    typeof infoMessage === 'string'
      ? infoMessage
      : infoMessage && formatMessage(infoMessage);

  return (
    <Tooltip
      placement="top-start"
      content={tooltipText || null}
      trigger={infoMessage ? 'hover' : 'disabled'}
      popperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-8, 8],
            },
          },
        ],
      }}
    >
      <div className={`${styles.wrapper} ${!infoMessage && styles.noPointer}`}>
        <Icon
          appearance={{ size: 'extraTiny' }}
          className={styles.icon}
          name={permissionIcon}
          title={translatedName}
        />
        {!minimal && (
          <span className={styles.label}>
            {translatedName}
            {inherited && '*'}
          </span>
        )}
      </div>
    </Tooltip>
  );
};

PermissionsLabel.displayName = displayName;

export default PermissionsLabel;
