import React from 'react';
import { Redirect } from 'react-router';

import { NOT_FOUND_ROUTE } from '~routes/index';
import { useDataSubscriber } from '~utils/hooks';
import { userSubscriber } from '../../subscribers';
import { useUserAddressFetcher } from '../../hooks';
import ProfileTemplate from '~pages/ProfileTemplate';
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

  const { error: userError, data: user, isFetching } = useDataSubscriber(
    userSubscriber,
    [userAddress as string],
    [userAddress],
  );

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
    </ProfileTemplate>
  );
};

export default UserProfile;
