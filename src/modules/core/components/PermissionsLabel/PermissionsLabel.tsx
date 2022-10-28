import React from 'react';
import { MessageDescriptor, useIntl, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import Icon from '~core/Icon';
import { Tooltip } from '../Popover';
import { permissionsObject } from './permissions';

import { UniversalMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './PermissionsLabel.css';

interface Appearance {
  theme: 'default' | 'simple' | 'white';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

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

  /** Optional info message about permission being inherited. */
  infoMessageValues?: UniversalMessageValues;

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
  infoMessageValues,
  minimal = false,
  appearance,
}: Props) => {
  const { formatMessage } = useIntl();
  const permissionDefaults = permissionsObject[permission];
  const permissionName = name || permissionDefaults.label;
  const permissionIcon = icon || permissionDefaults.icon;

  const translatedName =
    typeof permissionName === 'string'
      ? permissionName
      : formatMessage(permissionName);

  return (
    <Tooltip
      content={
        <div className={styles.tooltip}>
          {infoMessage && typeof infoMessage === 'object' ? (
            <FormattedMessage {...infoMessage} values={infoMessageValues} />
          ) : (
            infoMessage
          )}
        </div>
      }
      trigger={infoMessage ? 'hover' : null}
      popperOptions={{
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
      <div
        className={getMainClasses(appearance, styles, {
          noPointer: !infoMessage,
        })}
      >
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
