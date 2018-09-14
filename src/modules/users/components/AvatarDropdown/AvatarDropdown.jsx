/* @flow */
import React from 'react';

import Popover from '../../../core/components/Popover';
import UserAvatar from '../../../core/components/UserAvatar';

import MockUser from '../../__mocks__/MockUser';

import styles from './AvatarDropdown.css';

import AvatarDropdownPopover from './AvatarDropdownPopover.jsx';

const AvatarDropdown = () => (
  <Popover
    content={({ close }) => (
      <AvatarDropdownPopover user={MockUser} closePopover={close} />
    )}
  >
    {({ id, isOpen, toggle, ref }) => (
      <button
        aria-describedby={isOpen ? id : null}
        className={styles.avatarButton}
        onClick={toggle}
        ref={ref}
        type="button"
      >
        <UserAvatar username={MockUser.ensName} avatarURL={MockUser.avatar} />
      </button>
    )}
  </Popover>
);

export default AvatarDropdown;
