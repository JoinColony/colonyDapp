/* @flow */

import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import type { RootStateRecord, UserType } from '~immutable';

import { withImmutablePropsToJS } from '~utils/hoc';
import Popover from '~core/Popover';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { currentUserSelector } from '../../selectors';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

type Props = {|
  user: UserType,
|};

const displayName = 'users.AvatarDropdown';

/**
 * @todo Use data fetcher/selector for the current user in `AvatarDropdown`.
 */
const AvatarDropdown = ({ user }: Props) => (
  <Popover
    content={({ close }) => (
      <AvatarDropdownPopover user={user} closePopover={close} />
    )}
    trigger="click"
  >
    <button
      className={styles.avatarButton}
      type="button"
      data-test="avatarDropdown"
    >
      <UserAvatar address={user.profile.walletAddress} user={user} />
    </button>
  </Popover>
);

AvatarDropdown.displayName = displayName;

export default compose(
  connect((state: RootStateRecord) => ({
    user: currentUserSelector(state),
  })),
  withImmutablePropsToJS,
)(AvatarDropdown);
