import React from 'react';

import { MessageDescriptor, useIntl } from 'react-intl';
import Icon from '~core/Icon';
import { Tooltip } from '../Popover';

interface Props {
  /** Icon name for permission label */
  icon: string;

  /** Whether or not the permission is inherited. If `true`, will add * asterisk to permission name. */
  inherited?: boolean;

  /** Permission name */
  name: MessageDescriptor | string;

  /** Optional info message about permission being inherited. */
  infoMessage?: MessageDescriptor | string;
}

const displayName = 'Permission';

const Permission = ({ icon, inherited = false, name, infoMessage }: Props) => {
  const { formatMessage } = useIntl();
  const permissionName = typeof name === 'string' ? name : formatMessage(name);
  const tooltipText =
    typeof infoMessage === 'string'
      ? infoMessage
      : infoMessage && formatMessage(infoMessage);

  return (
    <Tooltip
      placement="left"
      content={tooltipText || null}
      trigger={inherited && infoMessage ? 'hover' : 'disabled'}
    >
      <div>
        <span>
          {permissionName}
          {inherited && '*'}
        </span>
        <Icon appearance={{ size: 'normal' }} name={icon} title={name} />
      </div>
    </Tooltip>
  );
};

Permission.displayName = displayName;

export default Permission;
