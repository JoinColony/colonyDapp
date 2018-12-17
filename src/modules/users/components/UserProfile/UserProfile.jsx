/* @flow */

import React, { Component } from 'react';

import ColonyGrid from '~core/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';

import ProfileTemplate from '~pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from '../../../../__mocks__/mockColonies';

import styles from './UserProfile.css';

import UserProfileSpinner from './UserProfileSpinner.jsx';

import type { ActionCreator } from '~types';
import type { UserRecord } from '~immutable';
import type { DataRecord } from '~utils/reducers';

type Props = {
  fetchUserProfile: ActionCreator,
  user: DataRecord<UserRecord>,
  username: string,
};

class UserProfile extends Component<Props> {
  componentDidMount() {
    const { fetchUserProfile, user, username } = this.props;
    if (!user && username) fetchUserProfile(username);
  }

  render() {
    const { user } = this.props;
    return user.fetching ? (
      <UserProfileSpinner />
    ) : (
      <ProfileTemplate asideContent={<UserMeta user={user} />}>
        <section className={styles.sectionContainer}>
          <ColonyGrid colonies={mockColonies} />
        </section>
        <section className={styles.sectionContainer}>
          <ActivityFeed activities={mockActivities} />
        </section>
      </ProfileTemplate>
    );
  }
}
export default UserProfile;
