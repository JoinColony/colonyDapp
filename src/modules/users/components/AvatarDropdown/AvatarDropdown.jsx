/* @flow */

import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { withImmutablePropsToJS } from '~utils/hoc';
import Popover from '~core/Popover';
import UserAvatar from '~core/UserAvatar';

import type { RootStateRecord, UserType } from '~immutable';

import { currentUser as currentUserSelector } from '../../selectors';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

type Props = {|
  user: UserType,
|};

const displayName = 'users.AvatarDropdown';

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
      <UserAvatar
        username={user.profile.username}
        avatarURL={user.profile.avatar}
        link={false}
      />
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
