/* @flow */

import React, { Component } from 'react';

import { defineMessages } from 'react-intl';

import ColonyGrid from '~core/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';

import LoadingTemplate from '~pages/LoadingTemplate';
import ProfileTemplate from '~pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from './__datamocks__/mockColonies';
import mockUser from './__datamocks__/mockUser';

import styles from './UserProfile.css';

type Props = {
  fetchUserProfile: func,
  targetProfile: Object,
  targetUserId: string,
  isLoading: boolean,
};

type State = {};

const MSG = defineMessages({
  loadingText: {
    id: 'ViewUserProfile.UserProfile.loadingText',
    defaultMessage: 'Fetching a user profile',
  },
  loaderDescription: {
    id: 'ViewUserProfile.UserProfile.loaderDescription',
    defaultMessage: 'Please wait while this user profile is being fetched.',
  },
});

const Spinner = () => <LoadingTemplate loadingText={MSG.loadingText} />;

class UserProfile extends Component<Props, State> {
  componentDidMount() {
    const { fetchUserProfile, targetProfile, targetUserId } = this.props;
    if (!targetProfile) {
      fetchUserProfile(targetUserId);
    }
  }

  render() {
    const { isLoading } = this.props;
    return isLoading ? (
      <Spinner />
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
