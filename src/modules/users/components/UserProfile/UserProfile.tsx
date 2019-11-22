import React from 'react';
import { Redirect } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { NOT_FOUND_ROUTE } from '~routes/index';
import { useDataSubscriber } from '~utils/hooks';
import { userSubscriber } from '../../subscribers';
import { useUserAddressFetcher } from '../../hooks';
import ProfileTemplate from '~pages/ProfileTemplate';
import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';
import styles from './UserProfile.css';

const USER = gql`
  {
    user {
      profile {
        walletAddress
        displayName
        bio
        location
        website
        avatarHash
      }
    }
  }
`;

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

  const { data } = useQuery(USER);

  const { error: userError, data: user, isFetching } = useDataSubscriber(
    userSubscriber,
    [userAddress as string],
    [userAddress],
  );

  const TEMP_user = data.user;

  if (TEMP_user && TEMP_user.profile) {
    TEMP_user.profile.username = username;
  }

  // Sometimes userAddress is not defined (because it is being fetched). Only if it *is* defined we should care about the error
  if (userAddressError || (userAddress && userError)) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!user || isFetching) {
    return <UserProfileSpinner />;
  }

  return (
    <ProfileTemplate asideContent={<UserMeta user={TEMP_user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={TEMP_user} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
