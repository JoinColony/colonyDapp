/* @flow */

import React from 'react';

import type { UserType } from '~immutable';

import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './UserMeta.css';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

type Props = {|
  user: UserType,
|};

const UserMeta = ({
  user: {
    profile: { username, displayName, bio, website, location, walletAddress },
  },
  user,
}: Props) => (
  <div className={styles.main}>
    <div data-test="userProfileAvatar">
      <UserAvatar
        className={styles.avatar}
        address={walletAddress}
        size="xl"
        user={user}
      />
    </div>
    <Heading
      appearance={{ margin: 'none', size: 'large' }}
      text={displayName}
      data-test="userProfileName"
    />
    <UserMention username={username || walletAddress} hasLink={false} />
    <CopyableAddress>{walletAddress}</CopyableAddress>
    {bio && (
      <div className={styles.bioContainer}>
        <p data-test="userProfileBio">{bio}</p>
      </div>
    )}
    {website && (
      <div className={styles.websiteContainer}>
        <a
          href={website}
          rel="noopener noreferrer"
          target="_blank"
          data-test="userProfileWebsite"
        >
          {website}
        </a>
      </div>
    )}
    {location && (
      <div className={styles.locationContainer}>
        <Heading
          appearance={{ size: 'normal', weight: 'thin' }}
          text={location}
          data-test="userProfileLocation"
        />
      </div>
    )}
  </div>
);

export default UserMeta;
