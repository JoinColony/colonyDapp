/* @flow */
import type { Node } from 'react';

import React from 'react';

import type { UserType } from '../../users/types';

import styles from './ProfileTemplate.css';

import UserMeta from './UserMeta.jsx';

type Props = {
  children: Node,
  user: UserType,
};

const displayName = 'pages.ProfileTemplate';

const ProfileTemplate = ({ children, user }: Props) => (
  <div className={styles.profileTemplate}>
    <aside className={styles.sidebar}>
      <UserMeta user={user} />
    </aside>
    <div className={styles.mainContainer}>
      {/* header will go here */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

ProfileTemplate.displayName = displayName;

export default ProfileTemplate;
