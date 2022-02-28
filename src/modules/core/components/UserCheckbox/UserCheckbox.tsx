import React, { useState } from 'react';

import { AddressZero } from 'ethers/constants';
import { Checkbox } from '~core/Fields';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { createAddress } from '~utils/web3';
import { Colony, useUser } from '~data/index';
import { Address } from '~types/index';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';

import styles from './UserCheckbox.css';

interface Props {
  colony: Colony;
  walletAddress: Address;
  name: string;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const UserCheckbox = ({ colony, walletAddress, name }: Props) => {
  const userProfile = useUser(createAddress(walletAddress || AddressZero));
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const {
    profile: { displayName, username },
  } = userProfile;

  return (
    <div className={`${styles.main} ${!isChecked && styles.notChecked}`}>
      <div className={styles.user}>
        <Checkbox
          name={name}
          value={walletAddress}
          className={styles.checkbox}
          onChange={(props) => setIsChecked(props.isChecked)}
          getDefaultValue={(checked) => setIsChecked(checked)}
        />
        <UserAvatar
          size="xs"
          colony={colony}
          address={walletAddress}
          user={userProfile}
          showInfo
          notSet={false}
        />
        <div className={styles.usernameSection}>
          {displayName && (
            <span className={styles.displayName} title={displayName}>
              {displayName}
            </span>
          )}
          {username && (
            <span className={styles.username}>
              <UserMention hasLink={false} username={username} />
            </span>
          )}
          <div className={styles.address}>
            <InvisibleCopyableAddress address={walletAddress}>
              <MaskedAddress address={walletAddress} />
            </InvisibleCopyableAddress>
          </div>
        </div>
      </div>
    </div>
  );
};

UserCheckbox.displayName = 'UserCheckbox';

export default UserCheckbox;
