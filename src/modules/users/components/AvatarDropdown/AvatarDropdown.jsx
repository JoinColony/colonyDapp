/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import Popover from '~core/Popover';
import UserAvatar from '~core/UserAvatar';

import type { UserRecord } from '~types';

import { currentUser as currentUserSelector } from '../../selectors';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

type Props = {
  user: UserRecord,
};

const displayName = 'users.AvatarDropdown';

const AvatarDropdown = ({ user }: Props) => (
  <Popover
    content={({ close }) => (
      <AvatarDropdownPopover user={user} closePopover={close} />
    )}
    trigger="click"
  >
    <button className={styles.avatarButton} type="button">
      <UserAvatar
        username={user.profile.username}
        avatarURL={user.profile.avatar}
        walletAddress={user.profile.walletAddress}
        link={false}
      />
    </button>
  </Popover>
);

AvatarDropdown.displayName = displayName;

export default connect(state => ({
  user: currentUserSelector(state),
}))(AvatarDropdown);
