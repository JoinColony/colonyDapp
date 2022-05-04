import React from 'react';

import HookedUserAvatar from '~users/HookedUserAvatar';
import MaskedAddress from '~core/MaskedAddress';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import { useUser, Colony } from '~data/index';
import { Address } from '~types/index';

import styles from './DetailsWidgetUser.css';

const displayName = 'DetailsWidgetUser';

interface Props {
  colony?: Colony;
  walletAddress: Address;
}

const DetailsWidgetUser = ({ colony, walletAddress }: Props) => {
  const UserAvatar = HookedUserAvatar({ fetchUser: false });
  const userProfile = useUser(walletAddress);
  const userDisplayName = userProfile?.profile?.displayName;
  const username = userProfile?.profile?.username;

  return (
    <div className={styles.main}>
      <UserAvatar
        colony={colony}
        size="s"
        notSet={false}
        user={userProfile}
        address={walletAddress || ''}
        showInfo
        popperOptions={{
          showArrow: false,
          placement: 'left',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ],
        }}
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
