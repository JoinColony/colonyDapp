import React from 'react';

import UserMention from '~core/UserMention';
import CopyableAddress from '~core/CopyableAddress';
import { AnyUser } from '~data/index';

import styles from './InfoPopover.css';

interface Props {
  user: AnyUser;
}

const displayName = 'core.InfoPopover.UserInfoPopover';

const UserInfoPopover = ({ user }: Props) => {
  const {
    displayName: userDisplayName,
    username,
    walletAddress,
  } = user.profile;

  return (
    <div className={styles.main}>
      {userDisplayName && (
        <p title={userDisplayName} className={styles.displayName}>
          {userDisplayName}
        </p>
      )}
      {username && (
        <p title={username} className={styles.userName}>
          <UserMention username={username} hasLink />
        </p>
      )}
      <div title={walletAddress} className={styles.address}>
        <CopyableAddress full>{walletAddress}</CopyableAddress>
      </div>
    </div>
  );
};

UserInfoPopover.displayName = displayName;

export default UserInfoPopover;
