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
import { userAddressFetcher, userFetcher } from '../../fetchers';

import UserMeta from './UserMeta.jsx';
import UserProfileSpinner from './UserProfileSpinner.jsx';

import styles from './UserProfile.css';

type Props = {|
  match: Match,
|};

const UserProfileTemplate = ({ address }: { address: string }) => {
  const userArgs = [address];
  const { data: user } = useDataFetcher<UserType>(
    userFetcher,
    userArgs,
    userArgs,
    { ttl: 1000 },
  );

  return user ? (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
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
};

const UserProfile = ({
  match: {
    params: { username },
  },
}: Props) => {
  const addressArgs = [username];
  const { data: address } = useDataFetcher<string>(
    userAddressFetcher,
    addressArgs,
    addressArgs,
  );

  return address ? (
    <UserProfileTemplate address={address} />
  ) : (
    <UserProfileSpinner />
  );
};

export default UserProfile;
