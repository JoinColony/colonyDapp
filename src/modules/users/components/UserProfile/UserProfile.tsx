import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { NOT_FOUND_ROUTE } from '~routes/index';
import ProfileTemplate from '~pages/ProfileTemplate';

import { useUserAddressFetcher } from '../../hooks';
import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserColonies from './UserColonies';
import styles from './UserProfile.css';

const USER = gql`
  query User($address: String!) {
    user(address: $address) {
      profile {
        username
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

  const [loadUser, { data, loading }] = useLazyQuery(USER, {
    variables: { address: userAddress },
  });

  useEffect(() => {
    if (userAddress) {
      loadUser();
    }
  }, [loadUser, userAddress]);

  if (!data || !data.user || loading) {
    return <UserProfileSpinner />;
  }

  if (userAddressError) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }
  const { user } = data;

  if (!user || loading) {
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
