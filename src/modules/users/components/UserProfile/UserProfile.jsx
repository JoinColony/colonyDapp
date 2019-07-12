/* @flow */

import type { Match } from 'react-router-dom';

import React from 'react';
import { Redirect } from 'react-router';

import type { Address } from '~types';
import type { UserType } from '~immutable';

import { NOT_FOUND_ROUTE } from '~routes';
import { useDataFetcher, useSelector } from '~utils/hooks';
import { userFetcher } from '../../fetchers';
import { currentUserColoniesFetcher } from '../../../dashboard/fetchers';
import { useUserAddressFetcher } from '../../hooks';
import { walletAddressSelector } from '../../selectors';

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
  const currentUserWalletAddress = useSelector(walletAddressSelector);
  /*
   * We need to overwrite the TTL, at least for the current user.
   *
   * This is what's happening in the background:
   * - User is created (w/o ens name), added to both current and all users
   * - Ens name is created, added only to current user
   * - Since the all users values were updated, they will not be refetched upon entering this page (lastFetchedAt)
   *
   * If you're realtively fast (under 1 min), if you just created your profile, you won't actually see your ens name, although created.
   * This is because we fetch data from all users, not current user (this page is general, not private)
   * Since the all users data was recently updated, the fetcher won't be triggered.
   *
   * To solve this, at least for the current user, we'll force it to re-fetch by overridding the TTL with 1
   */
  const ttlOverride =
    currentUserWalletAddress === userAddress ? { ttl: 1 } : {};

  const { error: userError, data: user, isFetching } = useDataFetcher<UserType>(
    userFetcher,
    [userAddress],
    [userAddress],
    ttlOverride,
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
