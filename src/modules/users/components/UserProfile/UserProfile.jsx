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

type Props = {
  fetchUserProfile: ActionCreator,
  user: UserRecord,
  username: string,
  isLoading: boolean,
};

class UserProfile extends Component<Props> {
  componentDidMount() {
    const { fetchUserProfile, user, username } = this.props;
    if (!user && username) fetchUserProfile(username);
  }

  render() {
    const { isLoading, user } = this.props;
    return isLoading || !user ? (
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
