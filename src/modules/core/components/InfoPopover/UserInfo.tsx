import React from 'react';

import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import UserMention from '~core/UserMention';
import UserAvatar from '~core/UserAvatar';

import { AnyUser } from '~data/index';
import useUserAvatarImageFromIPFS from '~utils/hooks/useUserAvatarImageFromIPFS';

import styles from './InfoPopover.css';

interface Props {
  user: AnyUser;
}

const displayName = 'InfoPopover.UserInfo';

const UserInfo = ({
  user: {
    profile: {
      displayName: userDisplayName,
      username,
      walletAddress,
      avatarHash,
    },
  },
  user,
}: Props) => {
  /*
   * @NOTE We have to fetch our avatar base64 data from IPFS because if we
   * use the "normal" HookedUserAvar we cause a circular call which will
   * exceed the call stack (obviously) and break React
   */
  const { image: avatarData } =
    useUserAvatarImageFromIPFS(avatarHash || '') || {};
  return (
    <div className={styles.container}>
      <UserAvatar
        size="s"
        address={walletAddress}
        user={user}
        notSet={false}
        avatarURL={avatarData}
      />
      <div className={styles.textContainer}>
        {userDisplayName && (
          <Heading
            appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
            text={userDisplayName}
          />
        )}
        {username && (
          /*
           * @NOTE Potential recurrsion loop here.
           *
           * Never pass `showInfo` to this instance of UserMention, otherwise you'll trigger it
           */
          <p className={styles.userName}>
            <UserMention username={username} hasLink />
          </p>
        )}
        <div className={styles.address}>
          <CopyableAddress full>{walletAddress}</CopyableAddress>
        </div>
      </div>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
