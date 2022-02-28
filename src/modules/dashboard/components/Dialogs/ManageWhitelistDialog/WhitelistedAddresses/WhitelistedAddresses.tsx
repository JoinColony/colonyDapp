import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import UserCheckbox from '~core/UserCheckbox';
import { Colony } from '~data/index';
import { Address } from '~types/index';
import Icon from '~core/Icon';

import styles from './WhitelistedAddresses.css';

interface Props {
  colony: Colony;
  whitelistedAddresses: Address[];
}

const MSG = defineMessages({
  search: {
    id: 'dashboard.ManageWhitelistDialog.WhitelistedAddresses.search',
    defaultMessage: 'Search...',
  },
});

const displayName = 'dashboard.ManageWhitelistDialog.WhitelistedAddresses';

const WhitelistedAddresses = ({ colony, whitelistedAddresses }: Props) => {
  const [addresses] = useState<Address[]>(whitelistedAddresses);
  const { formatMessage } = useIntl();

  const onChange = () => {
    // @TODO, implement searching
  };
  return (
    <div className={styles.main}>
      <div className={styles.searchContainer}>
        <input
          name="warning"
          className={styles.input}
          onChange={onChange}
          placeholder={formatMessage(MSG.search)}
        />
        <Icon className={styles.icon} name="search" title={MSG.search} />
      </div>
      <div className={styles.container}>
        {(addresses || []).map((address) => {
          return (
            <UserCheckbox
              key={address}
              colony={colony}
              name="whitelistedAddresses"
              walletAddress={address}
            />
          );
        })}
      </div>
    </div>
  );
};

WhitelistedAddresses.displayName = displayName;

export default WhitelistedAddresses;
