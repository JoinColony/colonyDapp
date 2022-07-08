import React from 'react';
import { defineMessages } from 'react-intl';

import { Colony, Maybe, useColonyExtensionsQuery } from '~data/index';
import DropdownMenu, {
  DropdownMenuItem,
  DropdownMenuSection,
} from '~core/DropdownMenu';
import {
  ColonySection,
  HelperSection,
  MetaSection,
  UserSection,
} from '~users/PopoverSection';
import NavLink from '~core/NavLink';

import styles from './HamburgerDropdownPopover.css';

const MSG = defineMessages({
  actions: {
    id: 'users.HamburgerDropdown.HamburgerDropdownPopover.link.actions',
    defaultMessage: 'Actions',
  },
  funds: {
    id: 'users.HamburgerDropdown.HamburgerDropdownPopover.link.funds',
    defaultMessage: 'Funds',
  },
  members: {
    id: 'users.HamburgerDropdown.HamburgerDropdownPopover.link.members',
    defaultMessage: 'Members',
  },
  extensions: {
    id: 'users.HamburgerDropdown.HamburgerDropdownPopover.link.extensions',
    defaultMessage: 'Extensions',
  },
  buyTokens: {
    id: 'users.HamburgerDropdown.HamburgerDropdownPopover.link.buyTokens',
    defaultMessage: 'Buy Tokens',
  },
});

const displayName = 'users.HamburgerDropdown.HamburgerDropdownPopover';

interface Props {
  onlyLogout?: boolean;
  closePopover: () => void;
  colony: Colony;
  colonyName: string;
  username?: Maybe<string>;
  isWalletConnected: boolean;
}

const HamburgerDropdownPopover = ({
  closePopover,
  onlyLogout,
  colony,
  colonyName,
  username,
  isWalletConnected = false,
}: Props) => {
  const colonyHomePath = `/colony/${colonyName}`;
  const { data } = useColonyExtensionsQuery({
    variables: { address: colony?.colonyAddress },
  });
  const coinMachineExtn = data?.processedColony.installedExtensions.find(
    ({ extensionId }) => extensionId === 'CoinMachine',
  );

  return (
    <div className={styles.menu}>
      <DropdownMenu onClick={closePopover}>
        {!onlyLogout && (
          <>
            {username && colonyName && (
              <DropdownMenuSection>
                <DropdownMenuItem>
                  <NavLink to={colonyHomePath} text={MSG.actions} exact />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink to={`${colonyHomePath}/funds`} text={MSG.funds} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink
                    to={`${colonyHomePath}/members`}
                    text={MSG.members}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NavLink
                    to={`${colonyHomePath}/extensions`}
                    text={MSG.extensions}
                  />
                </DropdownMenuItem>
                {coinMachineExtn &&
                  coinMachineExtn.details.initialized &&
                  !coinMachineExtn.details.deprecated && (
                    <DropdownMenuItem>
                      <NavLink
                        to={`${colonyHomePath}/buy-tokens`}
                        text={MSG.buyTokens}
                      />
                    </DropdownMenuItem>
                  )}
              </DropdownMenuSection>
            )}
            <UserSection colony={colony} username={username} />
            <ColonySection />
            <HelperSection />
          </>
        )}
        {isWalletConnected && <MetaSection />}
      </DropdownMenu>
    </div>
  );
};

HamburgerDropdownPopover.displayName = displayName;

export default HamburgerDropdownPopover;
