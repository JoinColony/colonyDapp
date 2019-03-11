/* @flow */

import React from 'react';

import type { DataType, UserType } from '~immutable';

import ColonyGrid from '~dashboard/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';
import ProfileTemplate from '~pages/ProfileTemplate';

import { withUserFromRoute } from '../../hocs';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from '../../../../__mocks__/mockColonies';

import styles from './UserProfile.css';

import UserMeta from './UserMeta.jsx';
import UserProfileSpinner from './UserProfileSpinner.jsx';

type Props = {|
  user: ?DataType<UserType>,
|};

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
