import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';

import styles from './WhitelistMembersListExtraContent.css';

const displayName = 'WhitelistMembersListExtraContent';

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

const WhitelistMembersListExtraContent = () => {
  // @TODO: Connect real date
  const placeholderDate = `${new Date().getDay()}.${new Date().getMonth()}.${new Date().getFullYear()}`;
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
        {/* @TODO:  Add interaction to remove an address from the list */}
        <Button appearance={{ theme: 'ghost', size: 'small' }}>
          <Icon name="close" title={MSG.removeButtonIconTitle} />
        </Button>
      </Tooltip>
    </div>
  );
};

WhitelistMembersListExtraContent.displayName = displayName;

export default WhitelistMembersListExtraContent;
