import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useMediaQuery } from 'react-responsive';

import Popover from '~core/Popover';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { Colony, useLoggedInUser } from '~data/index';
import { removeValueUnits } from '~utils/css';
import { SimpleMessageValues } from '~types/index';
import { UserTokenBalanceData } from '~types/tokens';
import AvatarDropdownPopover from './AvatarDropdownPopover';
import AvatarDropdownPopoverMobile from './AvatarDropdownPopoverMobile';

import { query700 as query } from '~styles/queries.css';
import styles, {
  refWidth,
  horizontalOffset,
  verticalOffset,
} from './AvatarDropdown.css';

const UserAvatar = HookedUserAvatar();

export interface AppState {
  previousWalletConnected: string | null;
  attemptingAutoLogin: boolean;
  userDataLoading: boolean;
  userCanNavigate: boolean;
}

interface Props {
  preventTransactions?: boolean;
  colony: Colony;
  spinnerMsg: SimpleMessageValues;
  tokenBalanceData: UserTokenBalanceData;
  appState: AppState;
}

const displayName = 'users.AvatarDropdown';

const AvatarDropdown = ({
  preventTransactions = false,
  colony,
  spinnerMsg,
  tokenBalanceData,
  appState,
}: Props) => {
  const isMobile = useMediaQuery({ query });
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
    return isMobile ? [-70, 5] : [-1 * skid, removeValueUnits(verticalOffset)];
  }, [isMobile]);

  const popoverContent = isMobile
    ? () =>
        username &&
        walletAddress && (
          <AvatarDropdownPopoverMobile
            {...{
              walletAddress,
              colony,
              appState,
              spinnerMsg,
              tokenBalanceData,
            }}
          />
        )
    : ({ close }) => (
        <AvatarDropdownPopover
          closePopover={close}
          walletConnected={!!walletAddress && !ethereal}
          {...{
            username,
            preventTransactions,
            colony,
          }}
        />
      );
  return (
    <Popover
      content={popoverContent}
      trigger="click"
      showArrow={false}
      popperOptions={{
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
      {({ isOpen, toggle, ref, id }) => (
        <button
          id={id}
          ref={ref}
          className={classnames(styles.avatarButton, {
            [styles.activeDropdown]: isOpen,
          })}
          onClick={toggle}
          type="button"
          data-test="avatarDropdown"
        >
          {walletAddress && (
            <UserAvatar
              address={walletAddress}
              notSet={ethereal}
              size={isMobile ? 'xs' : 's'}
            />
          )}
        </button>
      )}
    </Popover>
  );
};

AvatarDropdown.displayName = displayName;

export default AvatarDropdown;
