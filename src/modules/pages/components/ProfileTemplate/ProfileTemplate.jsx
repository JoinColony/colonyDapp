/* @flow */
import type { Node } from 'react';

import React from 'react';

import { getMainClasses } from '~utils/css';

import AvatarDropdown from '~dashboard/AvatarDropdown';

import Navigation from '~dashboard/Navigation';

import styles from './ProfileTemplate.css';

type Appearance = {
  theme: 'alt',
};

type Props = {
  appearance?: Appearance,
  children: Node,
  asideContent: Node,
};

// TODO: replace this with actual events, not sure where they will me from yet
const mockEvents = [{ handled: true }];

const displayName = 'pages.ProfileTemplate';

const ProfileTemplate = ({ appearance, children, asideContent }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <aside className={styles.sidebar}>{asideContent}</aside>
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <Navigation events={mockEvents} />
        <AvatarDropdown />
      </header>
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

ProfileTemplate.displayName = displayName;

export default ProfileTemplate;
