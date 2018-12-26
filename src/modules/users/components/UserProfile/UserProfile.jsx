/* @flow */

import React from 'react';

import ColonyGrid from '~core/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';
import { withUserFromRoute } from '../../hocs';

import ProfileTemplate from '~pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from '../../../../__mocks__/mockColonies';

import styles from './UserProfile.css';

import UserProfileSpinner from './UserProfileSpinner.jsx';

import type { DataRecord, UserRecord } from '~immutable';

type Props = {
  user: ?DataRecord<UserRecord>,
};

const UserProfile = ({ user }: Props) =>
  user && user.record ? (
    <ProfileTemplate asideContent={<UserMeta user={user.record} />}>
      <section className={styles.sectionContainer}>
        <ColonyGrid colonies={mockColonies} />
      </section>
      <section className={styles.sectionContainer}>
        <ActivityFeed activities={mockActivities} />
      </section>
    </ProfileTemplate>
  ) : (
    <UserProfileSpinner />
  );

export default withUserFromRoute(UserProfile);
