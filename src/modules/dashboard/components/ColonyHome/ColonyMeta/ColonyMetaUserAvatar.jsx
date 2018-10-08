/* @flow */

import React from 'react';

import UserAvatar from '~core/UserAvatar';
import UserInfo from '~core/UserInfo';

import styles from './ColonyMetaUserAvatar.css';

import type { UserType } from '../../../../users/types';

const componentDisplayName: string =
  'dashboard.ColonyHome.ColonyMeta.ColonyMetaUserAvatar';

type Props = {
  user: UserType,
};

const ColonyMetaUserAvatar = ({
  user: { avatar, ensName, displayName, walletAddress },
}: Props) => (
  <div className={styles.main}>
    <UserInfo
      displayName={displayName}
      username={ensName}
      walletAddress={walletAddress}
    >
      <div>
        {/*
          * The user avatar needs to be wrapped in a div element otherwise the
          * Tooltip Component won't detect it as a child, so it won't render
          */}
        <UserAvatar
          className={styles.avatar}
          avatarURL={avatar}
          walletAddress={walletAddress}
          /*
           * Empty username, since we don't want the browser tooltip
           * to also trigger
           */
          username=""
        />
      </div>
    </UserInfo>
  </div>
);

ColonyMetaUserAvatar.displayName = componentDisplayName;

export default ColonyMetaUserAvatar;
