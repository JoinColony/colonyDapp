/* @flow */

import React from 'react';

import Popover from '~core/Popover';
import UserAvatar from '~core/UserAvatar';
import { connect } from 'react-redux';

import type { UserRecord } from '~types/UserRecord';

import { currentUser as currentUserSelector } from '../../selectors';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

type Props = {
  user: UserRecord,
};

const displayName = 'user.AvatarDropdown';

const AvatarDropdown = ({ user }: Props) => (
  <Popover
    content={({ close }) => (
      <AvatarDropdownPopover user={user} closePopover={close} />
    )}
    trigger="click"
  >
    <button className={styles.avatarButton} type="button">
      <UserAvatar
        username={user.username}
        avatarURL={user.avatar}
        walletAddress={user.walletAddress}
      />
    </button>
  </Popover>
);

AvatarDropdown.displayName = displayName;

export default connect(state => ({
  user: currentUserSelector(state),
}))(AvatarDropdown);
