/* @flow */
import type { Node } from 'react';

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ProfileTemplate.css';

type Appearance = {
  theme: 'alt',
};

type Props = {|
  appearance?: Appearance,
  children: Node,
  asideContent: Node,
|};

const displayName = 'pages.ProfileTemplate';

const ProfileTemplate = ({ appearance, children, asideContent }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <aside className={styles.sidebar}>
      <div>{asideContent}</div>
    </aside>
    <div className={styles.mainContainer}>
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

ProfileTemplate.displayName = displayName;

export default ProfileTemplate;
