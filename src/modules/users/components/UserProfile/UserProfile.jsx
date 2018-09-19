/* @flow */
import React from 'react';

import ColonyGrid from '~core/ColonyGrid';

import ProfileTemplate from '../../../pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockColonies from './__mocks__/mockColonies';
import mockUser from './__mocks__/mockUser';

const UserProfile = () => (
  <ProfileTemplate asideContent={<UserMeta user={mockUser} />}>
    <ColonyGrid colonies={mockColonies} />
  </ProfileTemplate>
);

export default UserProfile;
