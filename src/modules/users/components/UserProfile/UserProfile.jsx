/* @flow */

import React, { Component } from 'react';

import ColonyGrid from '~core/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';

import ProfileTemplate from '~pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from './__datamocks__/mockColonies';
import mockUser from './__datamocks__/mockUser';

import styles from './UserProfile.css';

import UserProfileSpinner from './UserProfileSpinner.jsx';

type Props = {
  fetchUserProfile: Function,
  targetProfile: Object,
  targetUserId: string,
  isLoading: boolean,
};

class UserProfile extends Component<Props> {
  componentDidMount() {
    const { fetchUserProfile, targetProfile, targetUserId } = this.props;
    if (!targetProfile) {
      fetchUserProfile(targetUserId);
    }
  }

  render() {
    const { isLoading } = this.props;
    return isLoading ? (
      <UserProfileSpinner />
    ) : (
      <ProfileTemplate asideContent={<UserMeta user={mockUser} />}>
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
