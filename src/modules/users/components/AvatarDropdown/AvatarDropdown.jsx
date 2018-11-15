/* @flow */

import React from 'react';
import { connect } from 'react-redux';

import Popover from '~core/Popover';
import ConnectedUserAvatar from '../ConnectedUserAvatar';

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
      <ConnectedUserAvatar
        username={user.username}
        walletAddress={user.walletAddress}
      />
    </button>
  </Popover>
);

AvatarDropdown.displayName = displayName;

export default connect(state => ({
  user: currentUserSelector(state),
}))(AvatarDropdown);
