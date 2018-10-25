/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { USER_ROUTE } from '~routes';

import AvatarUploader from '~core/AvatarUploader';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import UserAvatar from '~core/UserAvatar';

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
  uploaderLabel: {
    id: 'users.UserProfileEdit.Sidebar.uploaderLabel',
    defaultMessage: 'At least 250x250px, up to 2MB',
  },
});

type Props = {
  /** URL to avatar to show when not uploading */
  avatarURL?: ?string,
  /** Address of the current user for identicon fallback */
  walletAddress: string,
  /** For UserAvatar title */
  username: string,
};

const displayName = 'users.UserProfileEdit.Sidebar';

// TODO: this should be an actual upload function
const upload = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return 'placeholder';
};

// TODO: this should be an actual remove function
const remove = async () => {};

const Sidebar = ({ avatarURL, walletAddress, username }: Props) => (
  <div>
    <Link className={styles.backLink} to={USER_ROUTE}>
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
    <AvatarUploader
      label={MSG.uploaderLabel}
      placeholder={
        <UserAvatar
          avatarURL={avatarURL}
          size="xl"
          title={MSG.uploaderLabel}
          walletAddress={walletAddress}
          username={username}
        />
      }
      upload={upload}
      remove={remove}
    />
  </div>
);

Sidebar.displayName = displayName;

export default Sidebar;
