/* @flow */
import React from 'react';

import Popover from '~core/Popover';
import UserAvatar from '~core/UserAvatar';

import mockUser from './__datamocks__/mockUser';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

const displayName: string = 'user.AvatarDropdown';

const AvatarDropdown = () => (
  <Popover
    content={({ close }) => (
      <AvatarDropdownPopover user={mockUser} closePopover={close} />
    )}
    trigger="click"
  >
    <button className={styles.avatarButton} type="button">
      <UserAvatar
        username={mockUser.username}
        avatarURL={mockUser.avatar}
        walletAddress={mockUser.walletAddress}
      />
    </button>
  </Popover>
);

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
