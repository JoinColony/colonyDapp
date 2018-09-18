/* @flow */
import React from 'react';

import Popover from '~core/Popover';
import UserAvatar from '~core/UserAvatar';

import MockUser from '../UserProfile/__mocks__/MockUser';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

const AvatarDropdown = () => (
  <Popover
    content={({ close }) => (
      <AvatarDropdownPopover user={MockUser} closePopover={close} />
    )}
    trigger="click"
  >
    <button className={styles.avatarButton} type="button">
      <UserAvatar
        username={MockUser.ensName}
        avatarURL={MockUser.avatar}
        walletAddress={MockUser.walletAddress}
      />
    </button>
  </Popover>
);

export default AvatarDropdown;
