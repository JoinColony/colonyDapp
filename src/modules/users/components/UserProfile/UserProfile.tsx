import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { NOT_FOUND_ROUTE } from '~routes/index';
import ProfileTemplate from '~pages/ProfileTemplate';
import {
  useFaunaUserByAddressLazyQuery,
  useFaunaUserByNameLazyQuery,
  AnyUser,
  useLoggedInUser,
  useContractUserLazyQuery,
  useContractUserByNameLazyQuery,
} from '~data/index';
import { isAddress } from '~utils/web3';

import UserMeta from './UserMeta';
import UserProfileSpinner from './UserProfileSpinner';
import UserProfileComments from '../UserProfileComments';

import styles from './UserProfile.css';

interface Props {
  match: any;
}

const UserProfile = ({
  match: {
    params: { username: usernameOrAddress },
  },
}: Props) => {
  const { decentralized, commentsEnabled } = useLoggedInUser();
  const loadByAddress = isAddress(usernameOrAddress);

  const [
    loadUserByAddress,
    { data: userDataByAddress, error: userErrorByAddress },
  ] = useFaunaUserByAddressLazyQuery();
  const [
    loadUserByName,
    { data: userDataByName, error: userErrorByName },
  ] = useFaunaUserByNameLazyQuery();
  const [
    loadContractUserByAddress,
    { data: contractUserDataByAddress, error: contractUserErrorByAddress },
  ] = useContractUserLazyQuery();
  const [
    loadContractUserByName,
    { data: contractUserDataByName, error: contractUserErrorByName },
  ] = useContractUserByNameLazyQuery();

  useEffect(() => {
    if (loadByAddress) {
      if (decentralized) {
        loadContractUserByAddress({
          variables: {
            address: usernameOrAddress,
          },
        });
      } else {
        loadUserByAddress({
          variables: {
            address: usernameOrAddress,
          },
        });
      }
    } else if (decentralized) {
      loadContractUserByName({
        variables: {
          username: usernameOrAddress,
        },
      });
    } else {
      loadUserByName({
        variables: {
          username: usernameOrAddress,
        },
      });
    }
  }, [
    decentralized,
    loadByAddress,
    loadContractUserByAddress,
    loadContractUserByName,
    loadUserByAddress,
    loadUserByName,
    usernameOrAddress,
  ]);

  if (
    userErrorByAddress ||
    userErrorByName ||
    contractUserErrorByAddress ||
    contractUserErrorByName
  ) {
    return <Redirect to={NOT_FOUND_ROUTE} />;
  }

  if (
    (decentralized &&
      loadByAddress &&
      !contractUserDataByAddress?.contractUser) ||
    (decentralized &&
      !loadByAddress &&
      !contractUserDataByName?.contractUserByName) ||
    (!decentralized &&
      loadByAddress &&
      !userDataByAddress?.faunaUserByAddress) ||
    (!decentralized && !loadByAddress && !userDataByName?.faunaUserByName)
  ) {
    return <UserProfileSpinner />;
  }

  let user;
  if (decentralized) {
    user = loadByAddress
      ? contractUserDataByAddress?.contractUser
      : contractUserDataByName?.contractUserByName;
  } else {
    user = loadByAddress
      ? userDataByAddress?.faunaUserByAddress
      : userDataByName?.faunaUserByName;
  }

  return (
    <ProfileTemplate asideContent={<UserMeta user={user as AnyUser} />}>
      <section className={styles.sectionContainer}>
        {process.env.STREAM_API && !decentralized && commentsEnabled && (
          <UserProfileComments channelId={user.id} />
        )}
      </section>
    </ProfileTemplate>
  );
};

export default UserProfile;
