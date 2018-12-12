/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import UserAvatarUploader from './UserAvatarUploader.jsx';

import styles from './Sidebar.css';

const MSG = defineMessages({
  iconBack: {
    id: 'users.UserProfileEdit.Sidebar.iconBack',
    defaultMessage: 'Back to profile',
  },
  backLink: {
    id: 'users.UserProfileEdit.Sidebar.backLink',
    defaultMessage: 'Back',
  },
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
  <div>
    <Link className={styles.backLink} to={`/user/${username}`}>
      <Icon
        appearance={{ size: 'medium' }}
        name="circle-back"
        title={MSG.iconBack}
      />
      <span className={styles.backLinkText}>
        <FormattedMessage {...MSG.backLink} />
      </span>
    </Link>
    <Heading
      appearance={{ theme: 'dark', size: 'medium' }}
      text={MSG.heading}
    />
    <UserAvatarUploader walletAddress={walletAddress} username={username} />
  </div>
);

Sidebar.displayName = displayName;

export default Sidebar;
