import React from 'react';

import HookedUserAvatar from '~users/HookedUserAvatar';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { useUser } from '~data/index';
import { Address } from '~types/index';

import styles from './DetailsWidgetUser.css';

const displayName = 'DetailsWidgetUser';

interface Props {
  walletAddress: Address;
}

const DetailsWidgetUser = ({ walletAddress }: Props) => {
  const UserAvatar = HookedUserAvatar({ fetchUser: false });
  const userProfile = useUser(walletAddress);
  const userDisplayName = userProfile?.profile?.displayName;
  const username = userProfile?.profile?.username;

  return (
    <div className={styles.main}>
      <UserAvatar
        size="s"
        notSet={false}
        user={userProfile}
        address={walletAddress || ''}
        showInfo
      />
      <div className={styles.textContainer}>
        {(userDisplayName || username) && (
          <div className={styles.username}>
            {userDisplayName || `@${username}`}
          </div>
        )}
        <InvisibleCopyableAddress address={walletAddress}>
          <div className={styles.address}>
            <MaskedAddress address={walletAddress} />
          </div>
        </InvisibleCopyableAddress>
      </div>
    </div>
  );
};

DetailsWidgetUser.displayName = displayName;

export default DetailsWidgetUser;
