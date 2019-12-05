import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { useLazyQuery } from '@apollo/react-hooks';

import { NOT_FOUND_ROUTE } from '~routes/index';
import ProfileTemplate from '~pages/ProfileTemplate';
import { UserDocument } from '~data/index';

import { useUserAddressFetcher } from '../../hooks';
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

  const [loadUser, { data, loading }] = useLazyQuery(UserDocument, {
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

  return (
    <ProfileTemplate asideContent={<UserMeta user={user} />}>
      <section className={styles.sectionContainer}>
        <UserColonies user={user} />
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
