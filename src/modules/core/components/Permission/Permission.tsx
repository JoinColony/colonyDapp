import React from 'react';

import { MessageDescriptor, useIntl } from 'react-intl';
import Icon from '~core/Icon';
import { Tooltip } from '../Popover';
import styles from './Permission.css';
import { permissionsObject } from './permissions';
import { ColonyRole } from '@colony/colony-js'

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
}

const displayName = 'Permission';

const Permission = ({
  permission,
  icon,
  inherited = false,
  name,
  infoMessage,
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
      placement="bottom"
      content={tooltipText || null}
      trigger={inherited && infoMessage ? 'hover' : 'disabled'}
    >
      <div className={styles.wrapper}>
        <Icon
          appearance={{ size: 'extraTiny' }}
          className={styles.icon}
          name={permissionIcon}
          title={translatedName}
        />
        <span className={styles.label}>
          {translatedName}
          {inherited && '*'}
        </span>
      </div>
    </Tooltip>
  );
};

Permission.displayName = displayName;

export default Permission;
