/* @flow */

import React from 'react';

import type { UserType } from '~immutable';

import CopyableAddress from '../core/CopyableAddress';
import Heading from '../core/Heading';
import UserMention from '../core/UserMention';
import UserAvatar from '~components/core/UserAvatar';

import styles from './UserMeta.css';

type Props = {|
  user: UserType,
|};

const UserMeta = ({
  user: {
    profile: {
      username,
      displayName,
      bio,
      website,
      location,
      walletAddress,
    } = {},
  },
}: Props) => (
  <div className={styles.main}>
    <UserAvatar
      className={styles.avatar}
      walletAddress={walletAddress}
      username={username}
      size="xl"
    />
    <Heading
      appearance={{ margin: 'none', size: 'large' }}
      text={displayName}
    />
    <UserMention username={username || walletAddress} to="/" />
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
