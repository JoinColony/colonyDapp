/* @flow */

import type { Match } from 'react-router-dom';

import React from 'react';
import { Redirect } from 'react-router';

import type { Address } from '~types';
import type { UserType } from '~immutable';

import { NOT_FOUND_ROUTE } from '~routes';
import { useDataFetcher } from '~utils/hooks';

import { userFetcher } from '../../fetchers';
import { currentUserColoniesFetcher } from '../../../dashboard/fetchers';
import { useUserAddressFetcher } from '../../hooks';

import ColonyGrid from '~dashboard/ColonyGrid';
import ActivityFeed from '~core/ActivityFeed';
import ProfileTemplate from '~pages/ProfileTemplate';

import mockActivities from './__datamocks__/mockActivities';

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
  const { userAddress, error: userAddressError } = useUserAddressFetcher(
    username,
  );

  const { error: userError, data: user, isFetching } = useDataFetcher<UserType>(
    userFetcher,
    [userAddress],
    [userAddress],
  );

  // Tracked in colonyDapp#1472
  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    currentUserColoniesFetcher,
    [],
    [],
  );

  if (!user || isFetching) {
    return <UserProfileSpinner />;
  }

  if (!isFetching && (userError || userAddressError)) {
    console.log(userError);
    console.log(userAddressError);
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

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
