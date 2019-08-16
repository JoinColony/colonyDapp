import React from 'react';
import { Redirect } from 'react-router';

import { ActivityFeedItemType, UserType } from '~immutable/index';
import { NOT_FOUND_ROUTE } from '~routes/index';
import { useDataSubscriber } from '~utils/hooks';
import { userSubscriber } from '../../subscribers';
import { useUserAddressFetcher } from '../../hooks';
import ActivityFeed from '~core/ActivityFeed';
import ProfileTemplate from '~pages/ProfileTemplate';
import mockActivities from './__datamocks__/mockActivities';
import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';
import styles from './UserProfile.css';

interface Props {
  match: any;
}

const UserProfile = ({
  match: {
    params: { username },
  },
}: Props) => {
  const { userAddress, error: userAddressError } = useUserAddressFetcher(
    username,
  );

  const { error: userError, data: user, isFetching } = useDataSubscriber<
    UserType
  >(userSubscriber, [userAddress], [userAddress]);

  // Sometimes userAddress is not defined (because it is being fetched). Only if it *is* defined we should care about the error
  if (userAddressError || (userAddress && userError)) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!user || isFetching) {
    return <UserProfileSpinner />;
  }

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={user} />
      </section>
      <section className={styles.sectionContainer}>
        <ActivityFeed activities={mockActivities as ActivityFeedItemType[]} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
