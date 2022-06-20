import React from 'react';

import { Colony, Maybe } from '~data/index';
import DropdownMenu from '~core/DropdownMenu';
import UserSection from '~users/PopoverSection/UserSection';
import ColonySection from '~users/PopoverSection/ColonySection';
import HelperSection from '~users/PopoverSection/HelperSection';
import MetaSection from '~users/PopoverSection/MetaSection';

interface Props {
  closePopover: () => void;
  username?: Maybe<string>;
  walletConnected?: boolean;
  onlyLogout?: boolean;
  colony: Colony;
}

const displayName = 'users.AvatarDropdown.AvatarDropdownPopover';

const AvatarDropdownPopover = ({
  closePopover,
  username,
  walletConnected = false,
  onlyLogout = false,
  colony,
}: Props) => {
  return (
    <DropdownMenu onClick={closePopover}>
      {!onlyLogout ? (
        <>
          {/* Move into separate components for reuse in HamburgerDropdownPopover */}
          <UserSection colony={colony} username={username} />
          <ColonySection />
          <HelperSection />
          {walletConnected && <MetaSection />}
        </>
      ) : (
        walletConnected && <MetaSection />
      )}
    </DropdownMenu>
  );
};

AvatarDropdownPopover.displayName = displayName;

export default AvatarDropdownPopover;
