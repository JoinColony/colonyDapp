/* @flow */

import type { Match } from 'react-router-dom';

import React from 'react';

import type { UserType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import ColonyGrid from '~dashboard/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';
import ProfileTemplate from '~pages/ProfileTemplate';

import mockActivities from './__datamocks__/mockActivities';
import mockColonies from '../../../../__mocks__/mockColonies';
import { userByUsernameFetcher } from '../../fetchers';

import UserMeta from './UserMeta.jsx';
import UserProfileSpinner from './UserProfileSpinner.jsx';

import styles from './UserProfile.css';

type Props = {|
  match: Match,
|};

const UserProfile = ({
  match: {
    params: { username },
  },
}: Props) => {
  const { data: user, isFetching } = useDataFetcher<UserType>(
    userByUsernameFetcher,
    [username],
    [username],
  );

  if (!user || isFetching) {
    return <UserProfileSpinner />;
  }

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <ColonyGrid colonies={mockColonies} />
      </section>
      <section className={styles.sectionContainer}>
        <ActivityFeed activities={mockActivities} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
