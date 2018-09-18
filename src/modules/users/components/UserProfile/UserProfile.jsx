/* @flow */
import React from 'react';

import ProfileTemplate from '../../../pages/ProfileTemplate';

import UserColonies from './UserColonies';
import UserMeta from './UserMeta.jsx';

import MockUser from './__mocks__/MockUser';

const UserProfile = () => (
  <ProfileTemplate asideContent={<UserMeta user={MockUser} />}>
    <UserColonies user={MockUser} />
  </ProfileTemplate>
);

export default UserProfile;
