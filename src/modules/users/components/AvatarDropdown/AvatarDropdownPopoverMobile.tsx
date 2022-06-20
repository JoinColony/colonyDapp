import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Colony } from '~data/index';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import MaskedAddress from '~core/MaskedAddress';
import MemberReputation from '~core/MemberReputation';
import { MiniSpinnerLoader } from '~core/Preloaders';
import { SimpleMessageValues } from '~types/index';
import { UserTokenBalanceData } from '~types/tokens';

import UserTokenActivationDisplay from '../UserTokenActivationButton/UserTokenActivationDisplay';
import { TokenActivationPopover } from '../TokenActivation';
import { AppState } from './AvatarDropdown';

import styles from './AvatarDropdownPopoverMobile.css';

const MSG = defineMessages({
  manageTokens: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.manageTokens',
    defaultMessage: 'Manage Tokens',
  },
  address: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.address',
    defaultMessage: 'Address',
  },
  balance: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.balance',
    defaultMessage: 'Balance',
  },
  reputation: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.reputation',
    defaultMessage: 'Reputation',
  },
});

interface Props {
  colony?: Colony;
  walletAddress: string;
  spinnerMsg: SimpleMessageValues;
  tokenBalanceData: UserTokenBalanceData;
  appState: AppState;
}

const displayName = 'users.AvatarDropdown.AvatarDropdownPopoverMobile';

const AvatarDropdownPopoverMobile = ({
  colony,
  walletAddress,
  spinnerMsg,
  tokenBalanceData,
  appState,
}: Props) => {
  const {
    nativeToken,
    activeBalance,
    inactiveBalance,
    totalBalance,
    lockedBalance,
    isPendingBalanceZero,
  } = tokenBalanceData;

  const {
    previousWalletConnected,
    attemptingAutoLogin,
    userDataLoading,
    userCanNavigate,
  } = appState;

  const colonyAddress = colony?.colonyAddress;
  const ItemContainer = ({
    message,
    children,
  }: {
    message: SimpleMessageValues;
    children?: React.ReactChild | false | null;
  }) => {
    return (
      <div className={styles.itemContainer}>
        <FormattedMessage {...message} />
        <div className={styles.itemChild}>
          {previousWalletConnected && attemptingAutoLogin && userDataLoading ? (
            <MiniSpinnerLoader
              className={styles.walletAutoLogin}
              title={spinnerMsg}
              titleTextValues={{ isMobile: true }}
            />
          ) : (
            children
          )}
        </div>
      </div>
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <ItemContainer message={MSG.address}>
            {colonyAddress && <MaskedAddress address={colonyAddress} />}
          </ItemContainer>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ItemContainer message={MSG.balance}>
            {userCanNavigate && nativeToken && (
              <UserTokenActivationDisplay
                {...{ nativeToken, inactiveBalance, totalBalance }}
              />
            )}
          </ItemContainer>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ItemContainer message={MSG.reputation}>
            {colonyAddress && (
              <MemberReputation
                walletAddress={walletAddress}
                colonyAddress={colonyAddress}
                showIconTitle={false}
              />
            )}
          </ItemContainer>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className={styles.buttonContainer}>
            {nativeToken && (
              <TokenActivationPopover
                activeTokens={activeBalance}
                inactiveTokens={inactiveBalance}
                totalTokens={totalBalance}
                lockedTokens={lockedBalance}
                token={nativeToken}
                {...{ colony, walletAddress, isPendingBalanceZero }}
              >
                {({ toggle, ref }) => (
                  <Button
                    appearance={{ theme: 'primary', size: 'medium' }}
                    onClick={toggle}
                    innerRef={ref}
                    data-test="manageTokensButton"
                  >
                    <FormattedMessage {...MSG.manageTokens} />
                  </Button>
                )}
              </TokenActivationPopover>
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuSection>
    </DropdownMenu>
  );
};

AvatarDropdownPopoverMobile.displayName = displayName;

export default AvatarDropdownPopoverMobile;
