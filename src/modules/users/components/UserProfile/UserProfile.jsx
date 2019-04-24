/* @flow */

import type { Match } from 'react-router-dom';

import React from 'react';

import type { Address } from '~types';
import type { UserType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import ColonyGrid from '~dashboard/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';
import ProfileTemplate from '~pages/ProfileTemplate';

import mockActivities from './__datamocks__/mockActivities';
import { userByUsernameFetcher } from '../../fetchers';
import { currentUserColoniesFetcher } from '../../../dashboard/fetchers';

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
  const { data: user } = useDataFetcher<UserType>(
    userByUsernameFetcher,
    [username],
    [username],
  );

  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    currentUserColoniesFetcher,
    [],
    [],
  );

  if (!user) return <UserProfileSpinner />;

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <ColonyGrid colonyAddresses={colonyAddresses || []} />
      </section>
      <section className={styles.sectionContainer}>
        <ActivityFeed activities={mockActivities} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
