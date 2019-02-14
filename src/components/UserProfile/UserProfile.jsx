/* @flow */

import React from 'react';

import ColonyGrid from '~components/core/ColonyGrid';
import ActivityFeed from '~components/core/ActivityFeed';
import { withUserFromRoute } from '~redux/hocs';

import ProfileTemplate from '~components/pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from '../../__mocks__/mockColonies';

import styles from './UserProfile.css';

import UserProfileSpinner from './UserProfileSpinner.jsx';

import type { DataType, UserType } from '~immutable';

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
