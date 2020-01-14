import React from 'react';
import { defineMessages } from 'react-intl';

import { AnyUser } from '~data/index';
import Heading from '~core/Heading';
import UserAvatarUploader from './UserAvatarUploader';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.Sidebar.heading',
    defaultMessage: 'Profile Picture',
  },
});

interface Props {
  user: AnyUser;
}

const displayName = 'users.UserProfileEdit.Sidebar';

const Sidebar = ({ user }: Props) => (
  <>
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <UserAvatarUploader user={user} />
  </>
);

Sidebar.displayName = displayName;

export default Sidebar;
