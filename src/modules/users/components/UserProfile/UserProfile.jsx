/* @flow */
import React from 'react';

import ColonyGrid from '~core/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';

import ProfileTemplate from '../../../pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from './__datamocks__/mockColonies';
import mockUser from './__datamocks__/mockUser';

import styles from './UserProfile.css';

// @NOTE userId can be accessed from the props: `{ match: { userId } }`
const UserProfile = () => (
  <ProfileTemplate asideContent={<UserMeta user={mockUser} />}>
    <section className={styles.sectionContainer}>
      <ColonyGrid colonies={mockColonies} />
    </section>
    <section className={styles.sectionContainer}>
      <ActivityFeed activities={mockActivities} />
    </section>
  </ProfileTemplate>
);

export default UserProfile;
