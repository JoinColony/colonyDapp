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
  // @TODO: Connect real date
  const placeholderDate = `${new Date().getDay()}.${new Date().getMonth()}.${new Date().getFullYear()}`;
  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress,
      userAddress,
    })),
    [userAddress, colonyAddress],
  );
  return (
    <div className={styles.container}>
      <p className={styles.date}>{placeholderDate}</p>
      <Tooltip
        appearance={{ theme: 'dark' }}
        content={
          <div className={styles.tooltip}>
            <FormattedMessage {...MSG.tooltipMessage} />
          </div>
        }
        trigger="hover"
        popperProps={{
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
          submit={ActionTypes.REMOVE_FROM_WHITELIST}
          error={ActionTypes.REMOVE_FROM_WHITELIST_ERROR}
          success={ActionTypes.REMOVE_FROM_WHITELIST_SUCCESS}
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
