import React from 'react';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { AnyUser } from '~data/index';

import styles from './UserInfo.css';

const displayName = 'dashboard.Incorporation.UserInfo';

export interface Props {
  user: AnyUser;
}

const UserInfo = ({ user }: Props) => {
  const {
    walletAddress,
    username,
    displayName: userDisplayName,
  } = user.profile;

  return (
    <div className={styles.container}>
      <UserAvatar address={walletAddress || ''} size="xs" notSet={false} />
      <div className={styles.userName}>
        <UserMention username={username || userDisplayName || ''} />
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
