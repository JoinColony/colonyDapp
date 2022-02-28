import React, { useState } from 'react';

import UserCheckbox from '~core/UserCheckbox';
import { Colony } from '~data/index';
import { Address } from '~types/index';

import styles from './WhitelistedAddresses.css';

interface Props {
  colony: Colony;
  whitelistedAddresses: Address[];
}

const displayName = 'dashboard.ManageWhitelistDialog.WhitelistedAddresses';

const WhitelistedAddresses = ({ colony, whitelistedAddresses }: Props) => {
  const [addresses] = useState<Address[]>(
    whitelistedAddresses,
  );
  return (
    <div className={styles.main}>
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
