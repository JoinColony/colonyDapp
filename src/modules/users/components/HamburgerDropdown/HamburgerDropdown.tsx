import React from 'react';
import classnames from 'classnames';

import HamburgerMenu from '~core/HamburgerMenu/HamburgerMenu';
import Popover from '~core/Popover';
import { Colony, useLoggedInUser } from '~data/index';
import HamburgerDropdownPopover from './HamburgerDropdownPopover';

import styles from './HamburgerDropdown.css';

interface Props {
  onlyLogout?: boolean;
  colony: Colony;
  colonyName: string;
}

const displayName = 'users.HamburgerDropdown';

const HamburgerDropdown = ({ onlyLogout, colony, colonyName }: Props) => {
  const { username, walletAddress, ethereal } = useLoggedInUser();
  return (
    <Popover
      content={({ close }) => (
        <HamburgerDropdownPopover
          closePopover={close}
          isWalletConnected={!!walletAddress && !ethereal}
          {...{
            colony,
            colonyName,
            onlyLogout,
            username,
          }}
        />
      )}
      trigger="click"
      showArrow={false}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 0],
            },
          },
        ],
      }}
    >
      {({ isOpen, toggle, ref, id }) => (
        <button
          id={id}
          ref={ref}
          className={classnames(styles.hamburgerButton, {
            [styles.activeDropdown]: isOpen,
          })}
          onClick={toggle}
          type="button"
          data-test="hamburgerDropdown"
        >
          <HamburgerMenu {...{ isOpen }} />
        </button>
      )}
    </Popover>
  );
};

HamburgerDropdown.displayName = displayName;

export default HamburgerDropdown;
