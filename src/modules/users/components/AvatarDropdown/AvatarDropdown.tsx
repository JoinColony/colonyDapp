import React from 'react';

import Popover from '~core/Popover';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useLoggedInUser } from '~data/helpers';

import AvatarDropdownPopover from './AvatarDropdownPopover';

import styles from './AvatarDropdown.css';

const UserAvatar = HookedUserAvatar();

const displayName = 'users.AvatarDropdown';

const AvatarDropdown = () => {
  const { username, walletAddress } = useLoggedInUser();
  return (
    <Popover
      content={({ close }) => (
        <AvatarDropdownPopover username={username} closePopover={close} />
      )}
      trigger="click"
    >
      <button
        className={styles.avatarButton}
        type="button"
        data-test="avatarDropdown"
      >
        <UserAvatar address={walletAddress} />
      </button>
    </Popover>
  );
};

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
