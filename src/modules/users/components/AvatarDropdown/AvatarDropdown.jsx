/* @flow */

import React from 'react';

import type { UserType } from '~immutable';

import { useDataFetcher, useSelector } from '~utils/hooks';
import Popover from '~core/Popover';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { userFetcher } from '../../fetchers';
import { walletAddressSelector } from '../../selectors';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const displayName = 'users.AvatarDropdown';

const AvatarDropdown = () => {
  const walletAddress = useSelector(walletAddressSelector);
  const { data: user } = useDataFetcher<UserType>(
    userFetcher,
    [walletAddress],
    [walletAddress],
  );

  return (
    <Popover
      content={({ close }) =>
        user ? <AvatarDropdownPopover user={user} closePopover={close} /> : null
      }
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
