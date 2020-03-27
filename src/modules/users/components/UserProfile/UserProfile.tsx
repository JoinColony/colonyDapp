import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { NOT_FOUND_ROUTE } from '~routes/index';
import ProfileTemplate from '~pages/ProfileTemplate';
import { useUserLazyQuery, useUserAddressQuery } from '~data/index';

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
  const { data: userAddress, error: userAddressError } = useUserAddressQuery({
    variables: {
      name: username,
    },
  });

  const [loadUser, { data }] = useUserLazyQuery();

  useEffect(() => {
    if (
      userAddress &&
      userAddress.userByName &&
      userAddress.userByName.profile &&
      userAddress.userByName.profile.walletAddress
    ) {
      const { walletAddress: address } = userAddress.userByName.profile;
      loadUser({
        variables: { address },
      });
    }
  }, [loadUser, userAddress]);

  if (userAddressError) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (!data || !data.user) {
    return <UserProfileSpinner />;
  }

  const { user } = data;

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={user} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
