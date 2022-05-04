import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionButton } from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { Address } from '~types/index';

import styles from './WhitelistMembersListExtraContent.css';

const displayName =
  'dashboard.Whitelist.WhitelistAddresses.WhitelistMembersListExtraContent';

const MSG = defineMessages({
  removeButtonIconTitle: {
    id: `dashboard.Whitelist.WhitelistAddresses.WhitelistMembersListExtraContent.removeButtonIconTitle`,
    defaultMessage: 'Remove',
  },
  tooltipMessage: {
    id: `dashboard.Whitelist.WhitelistAddresses.WhitelistMembersListExtraContent.tooltipMessage`,
    defaultMessage: 'Remove selected address from the whitelist.',
  },
});

interface Props {
  colonyAddress: Address;
  userAddress: Address;
}

const WhitelistMembersListExtraContent = ({
  colonyAddress,
  userAddress,
}: Props) => {
  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddresses: [userAddress],
      status: false,
    })),
    [userAddress, colonyAddress],
  );
  return (
    <div className={styles.container}>
      <Tooltip
        content={
          <div className={styles.tooltip}>
            <FormattedMessage {...MSG.tooltipMessage} />
          </div>
        }
        trigger="hover"
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [103, 5],
              },
            },
          ],
        }}
      >
        <ActionButton
          appearance={{ theme: 'ghost', size: 'small' }}
          submit={ActionTypes.WHITELIST_UPDATE}
          error={ActionTypes.WHITELIST_UPDATE_ERROR}
          success={ActionTypes.WHITELIST_UPDATE_SUCCESS}
          transform={transform}
        >
          <Icon name="close" title={MSG.removeButtonIconTitle} />
        </ActionButton>
      </Tooltip>
    </div>
  );
};

WhitelistMembersListExtraContent.displayName = displayName;

export default WhitelistMembersListExtraContent;
