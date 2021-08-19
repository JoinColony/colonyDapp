import React from 'react';

import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import UserMention from '~core/UserMention';
import { AnyUser } from '~data/index';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './InfoPopover.css';

interface Props {
  user: AnyUser;
}

const displayName = 'InfoPopover.UserInfo';

const UserAvatar = HookedUserAvatar();

const UserInfo = ({
  user: {
    profile: { displayName: userDisplayName, username, walletAddress },
  },
  user,
}: Props) => (
  <>
    <UserAvatar size="s" address={walletAddress} user={user} notSet={false} />
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
  </>
);

UserInfo.displayName = displayName;

export default UserInfo;
