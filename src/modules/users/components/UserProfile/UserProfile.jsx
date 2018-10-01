/* @flow */
import React from 'react';

import ColonyGrid from '~core/ColonyGrid';

import ProfileTemplate from '../../../pages/ProfileTemplate';
import UserMeta from './UserMeta.jsx';

import mockColonies from './__datamocks__/mockColonies';
import mockUser from './__datamocks__/mockUser';

// @NOTE userId can be accessed from the props: `{ match: { userId } }`
const UserProfile = () => (
  <ProfileTemplate asideContent={<UserMeta user={mockUser} />}>
    <ColonyGrid colonies={mockColonies} />
  </ProfileTemplate>
);

export default UserProfile;
