/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './ProfileTemplate.css';

type Props = {
  children: Node,
  asideContent: Node,
};

const displayName = 'pages.ProfileTemplate';

const ProfileTemplate = ({ children, asideContent }: Props) => (
  <div className={styles.profileTemplate}>
    <aside className={styles.sidebar}>{asideContent}</aside>
    <div className={styles.mainContainer}>
      {/* header will go here */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

ProfileTemplate.displayName = displayName;

export default ProfileTemplate;
