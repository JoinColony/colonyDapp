import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isAddress } from '~utils/web3';

import { NOT_FOUND_ROUTE } from '~routes/index';
import ProfileTemplate from '~pages/ProfileTemplate';
import { useUserLazyQuery, useUserByNameLazyQuery, AnyUser } from '~data/index';

import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';

import styles from './UserProfile.css';

interface Props {
  match: any;
}

const UserProfile = ({
  match: {
    params: { username: usernameOrAddress },
  },
}: Props) => {
  const loadByAddress = isAddress(usernameOrAddress);

  const [
    loadUserByAddress,
    { data: userDataByAddress, error: userErrorByAddress },
  ] = useUserLazyQuery();
  const [
    loadUserByName,
    { data: userDataByName, error: userErrorByName },
  ] = useUserByNameLazyQuery();

  useEffect(() => {
    if (loadByAddress) {
      loadUserByAddress({
        variables: {
          address: usernameOrAddress,
        },
      });
    } else {
      loadUserByName({
        variables: {
          username: usernameOrAddress,
        },
      });
    }
  }, [loadByAddress, loadUserByAddress, loadUserByName, usernameOrAddress]);

  if (userErrorByAddress || userErrorByName) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (
    (loadByAddress && !userDataByAddress?.user) ||
    (!userDataByAddress && !userDataByName?.userByName)
  ) {
    return <UserProfileSpinner />;
  }

  const user = loadByAddress
    ? userDataByAddress?.user
    : userDataByName?.userByName;

  return (
    <ProfileTemplate asideContent={<UserMeta user={user as AnyUser} />}>
      <section className={styles.sectionContainer} />
    </ProfileTemplate>
  );
};

export default UserProfile;
