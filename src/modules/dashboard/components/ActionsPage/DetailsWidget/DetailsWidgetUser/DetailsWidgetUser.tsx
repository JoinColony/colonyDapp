import React from 'react';
import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import MaskedAddress from '~core/MaskedAddress';
import styles from './DetailsWidgetUser.css';
import { useUser } from '~data/index';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';

const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetUser';

interface Props {
  walletAddress: Address;
}

const DetailsWidgetUser = ({ walletAddress }: Props) => {
  const UserAvatar = HookedUserAvatar({ fetchUser: false });
  const userProfile = useUser(walletAddress);
  const username = userProfile?.profile?.username;

  return (
    <div className={styles.main}>
      <UserAvatar size="s" notSet={false} address={walletAddress || ''} showInfo />
      {username && <div className={styles.username}>@{username}</div>}
      <InvisibleCopyableAddress address={walletAddress}>
        <div className={styles.address}>
          <MaskedAddress address={walletAddress} />
        </div>
      </InvisibleCopyableAddress>
    </div>
  );
};

DetailsWidgetUser.displayName = displayName;

export default DetailsWidgetUser;
