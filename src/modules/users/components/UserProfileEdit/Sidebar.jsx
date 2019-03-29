/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { UserType } from '~immutable';

import Heading from '~core/Heading';

import UserAvatarUploader from './UserAvatarUploader.jsx';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.Sidebar.heading',
    defaultMessage: 'Profile Picture',
  },
});

type Props = {|
  user: UserType,
|};

const displayName = 'users.UserProfileEdit.Sidebar';

const Sidebar = ({ user }: Props) => (
  <Fragment>
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <UserAvatarUploader user={user} />
  </Fragment>
);

Sidebar.displayName = displayName;

export default Sidebar;
