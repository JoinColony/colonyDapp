import React, { useState, useCallback, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import UserCheckbox from '~core/UserCheckbox';
import { Colony, AnyUser } from '~data/index';
import Icon from '~core/Icon';
import { filterUserSelection } from '~core/SingleUserPicker';

import styles from './WhitelistedAddresses.css';

interface Props {
  colony: Colony;
  whitelistedUsers: AnyUser[];
}

const MSG = defineMessages({
  search: {
    id: `dashboard.ManageWhitelistDialog.WhitelistedAddresses.search`,
    defaultMessage: 'Search...',
  },
  checkedTooltipText: {
    id: `dashboard.ManageWhitelistDialog.WhitelistedAddresses.checkedTooltipText`,
    defaultMessage: `User is added to the address book. Uncheck to remove.`,
  },
  unCheckedTooltipText: {
    id: `dashboard.ManageWhitelistDialog.WhitelistedAddresses.unCheckedTooltipText`,
    defaultMessage: `User will be removed from the address book.`,
  },
});

const displayName = 'dashboard.ManageWhitelistDialog.WhitelistedAddresses';

const WhitelistedAddresses = ({ colony, whitelistedUsers }: Props) => {
  const [users, setUsers] = useState<AnyUser[]>(whitelistedUsers);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (whitelistedUsers?.length) {
      setUsers(whitelistedUsers);
    }
  }, [whitelistedUsers]);

  const handleOnChange = useCallback(
    (e) => {
      if (e.target?.value) {
        const [, ...filteredUsers] = filterUserSelection(
          whitelistedUsers,
          e.target?.value,
        );
        setUsers(filteredUsers);
      }
    },
    [whitelistedUsers, setUsers],
  );

  return (
    <div className={styles.main}>
      <div className={styles.searchContainer}>
        <input
          name="warning"
          className={styles.input}
          onChange={handleOnChange}
          placeholder={formatMessage(MSG.search)}
        />
        <Icon className={styles.icon} name="search" title={MSG.search} />
      </div>
      <div className={styles.container}>
        {(users || []).map((user) => {
          return (
            <UserCheckbox
              key={user.profile?.walletAddress || user.id}
              colony={colony}
              name="whitelistedAddresses"
              walletAddress={user.profile?.walletAddress || user.id}
              checkedTooltipText={formatMessage(MSG.checkedTooltipText)}
              unCheckedTooltipText={formatMessage(MSG.unCheckedTooltipText)}
              showDisplayName={false}
            />
          );
        })}
      </div>
    </div>
  );
};

WhitelistedAddresses.displayName = displayName;

export default WhitelistedAddresses;
