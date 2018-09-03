/* @flow */
import React from 'react';

import type { UserType } from '../../users/types';

import Heading from '../../core/components/Heading';
import Link from '../../core/components/Link';
import UserAvatar from '../../core/components/UserAvatar';

import styles from './UserMeta.css';

type Props = {
  user: UserType,
};

const UserMeta = ({ user }: Props) => (
  <div className={styles.main}>
    <UserAvatar avatarURL={user.avatar} username={user.ensName} size="l" />
    <Heading
      appearance={{ margin: 'none', size: 'medium', weight: 'bold' }}
      text={user.displayName}
    />
    <Link text={user.ensName} to="/" />
    <div className={styles.bioContainer}>
      <p>{user.bio}</p>
    </div>
    <div className={styles.websiteContainer}>
      <Link text={user.website} to={user.website} />
    </div>
    <div className={styles.locationContainer}>
      <Heading
        appearance={{ size: 'normal', weight: 'thin' }}
        text={user.location}
      />
    </div>
  </div>
);

export default UserMeta;
