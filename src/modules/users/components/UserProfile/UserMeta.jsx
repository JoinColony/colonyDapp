/* @flow */

import React from 'react';

import type { UserType } from '../../types';

import CopyableAddress from '../../../core/components/CopyableAddress';
import Heading from '../../../core/components/Heading';
import UserAvatar from '../../../core/components/UserAvatar';
import UserMention from '../../../core/components/UserMention';

import styles from './UserMeta.css';

type Props = {
  user: UserType,
};

const UserMeta = ({
  user: { avatar, ensName, displayName, bio, website, location, walletAddress },
}: Props) => (
  <div className={styles.main}>
    <UserAvatar
      className={styles.avatar}
      avatarURL={avatar}
      walletAddress={walletAddress}
      username={ensName}
      size="xl"
    />
    <Heading
      appearance={{ margin: 'none', size: 'large' }}
      text={displayName}
    />
    <UserMention ensName={ensName} to="/" />
    <CopyableAddress>{walletAddress}</CopyableAddress>
    {bio && (
      <div className={styles.bioContainer}>
        <p>{bio}</p>
      </div>
    )}
    {website && (
      <div className={styles.websiteContainer}>
        <a href={website} rel="noopener noreferrer" target="_blank">
          {website}
        </a>
      </div>
    )}
    {location && (
      <div className={styles.locationContainer}>
        <Heading
          appearance={{ size: 'normal', weight: 'thin' }}
          text={location}
        />
      </div>
    )}
  </div>
);

export default UserMeta;
