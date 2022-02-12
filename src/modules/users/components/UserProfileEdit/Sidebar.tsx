import React from 'react';
import { defineMessages } from 'react-intl';

import { AnyUser } from '~data/index';
import Heading from '~core/Heading';
// import UserAvatarUploader from './UserAvatarUploader';
import HookedUserAvatar from '~users/HookedUserAvatar';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

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
    <UserAvatar
      address={user.profile.walletAddress}
      user={user}
      size="xl"
      notSet={false}
    />
  </>
);

Sidebar.displayName = displayName;

export default Sidebar;
