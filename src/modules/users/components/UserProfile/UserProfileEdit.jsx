/* @flow */

import React from 'react';

import ProfileTemplate from '../../../pages/ProfileTemplate';

import UserColonies from './UserColonies';

import MockUser from './__mocks__/MockUser';

const UserProfileEdit = () => (
  <ProfileTemplate asideContent={<div />}>
    <UserColonies user={MockUser} />
  </ProfileTemplate>
);

export default UserProfileEdit;
