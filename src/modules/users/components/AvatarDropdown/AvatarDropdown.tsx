import React, { useMemo } from 'react';

import Popover from '~core/Popover';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { useLoggedInUser } from '~data/index';
import { removeValueUnits } from '~utils/css';

import AvatarDropdownPopover from './AvatarDropdownPopover';

import styles, {
  refWidth,
  horizontalOffset,
  verticalOffset,
} from './AvatarDropdown.css';

const UserAvatar = HookedUserAvatar();

const displayName = 'users.AvatarDropdown';

const AvatarDropdown = () => {
  const { username, walletAddress, ethereal } = useLoggedInUser();

  /*
   * @NOTE Offset Calculations
   * See: https://popper.js.org/docs/v2/modifiers/offset/
   *
   * Skidding:
   * The Width of the reference element (width) plus the horizontal offset
   * Note that all skidding, for bottom aligned elements, needs to be negative.
   *
   * Distace:
   * This is just the required offset in pixels. Since we are aligned at
   * the bottom of the screen, this will be added to the bottom of the
   * reference element.
   */
  const popoverOffset = useMemo(() => {
    const skid =
      removeValueUnits(refWidth) + removeValueUnits(horizontalOffset);
    return [-1 * skid, removeValueUnits(verticalOffset)];
  }, []);

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
      showArrow={false}
      popperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popoverOffset,
            },
          },
        ],
      }}
    >
      <button
        className={styles.avatarButton}
        type="button"
        data-test="avatarDropdown"
      >
        <UserAvatar address={walletAddress} notSet={ethereal} size="s" />
      </button>
    </Popover>
  );
};

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
