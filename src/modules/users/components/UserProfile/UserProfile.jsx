/* @flow */
import React from 'react';

import ProfileTemplate from '../../../pages/ProfileTemplate';

import MockUser from './__mocks__/MockUser';

const UserProfile = () => (
  <ProfileTemplate user={MockUser}>
    <h1>Colonies & Activity</h1>
  </ProfileTemplate>
);

export default UserProfile;
