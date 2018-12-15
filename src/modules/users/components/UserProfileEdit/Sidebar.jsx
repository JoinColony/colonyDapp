/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import UserAvatarUploader from './UserAvatarUploader.jsx';

const MSG = defineMessages({
  heading: {
    id: 'users.UserProfileEdit.Sidebar.heading',
    defaultMessage: 'Profile Picture',
  },
});

type Props = {
  /** Address of the current user for identicon fallback */
  walletAddress: string,
  /** For UserAvatar title */
  username: string,
};

const displayName = 'users.UserProfileEdit.Sidebar';

const Sidebar = ({ walletAddress, username }: Props) => (
  <Fragment>
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <UserAvatarUploader walletAddress={walletAddress} username={username} />
  </Fragment>
);

Sidebar.displayName = displayName;

export default Sidebar;
