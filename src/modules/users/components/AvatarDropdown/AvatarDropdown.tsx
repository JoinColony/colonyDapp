import React from 'react';

import Popover from '~core/Popover';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useLoggedInUser } from '~data/index';

import AvatarDropdownPopover from './AvatarDropdownPopover';

import styles from './AvatarDropdown.css';

const UserAvatar = HookedUserAvatar();

const displayName = 'users.AvatarDropdown';

const AvatarDropdown = () => {
  const { username, walletAddress, ethereal } = useLoggedInUser();
  return (
    <Popover
      content={({ close }) => (
        <AvatarDropdownPopover
          closePopover={close}
          username={username}
          walletConnected={!!walletAddress && !ethereal}
        />
      )}
      trigger="click"
    >
      <button
        className={styles.avatarButton}
        type="button"
        data-test="avatarDropdown"
      >
        <UserAvatar address={walletAddress} notSet={ethereal} />
      </button>
    </Popover>
  );
};

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
