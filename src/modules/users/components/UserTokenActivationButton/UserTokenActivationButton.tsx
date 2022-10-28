import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TokenActivationPopover } from '~users/TokenActivation';
import { Tooltip } from '~core/Popover';
import { FullColonyFragment } from '~data/index';
import { Address } from '~types/index';
import UserTokenActivationDisplay from './UserTokenActivationDisplay';
import { UserTokenBalanceData } from '~types/tokens';

import styles from './UserTokenActivationButton.css';

const displayName = 'users.UserTokenActivationButton';

const MSG = defineMessages({
  tooltip: {
    id: 'users.UserTokenActivationButton.tooltip',
    defaultMessage:
      'View and activate tokens for staking or claim any unclaimed stakes.',
  },
});
interface Props {
  colony?: FullColonyFragment;
  walletAddress: Address;
  dataTest: string;
  tokenBalanceData: UserTokenBalanceData;
}

const UserTokenActivationButton = ({
  colony,
  walletAddress,
  dataTest,
  tokenBalanceData,
}: Props) => {
  const {
    nativeToken,
    activeBalance,
    inactiveBalance,
    totalBalance,
    lockedBalance,
    isPendingBalanceZero,
  } = tokenBalanceData; // State shared with AvatarDropdownPopoverMobile

  return (
    <TokenActivationPopover
      activeTokens={activeBalance}
      inactiveTokens={inactiveBalance}
      totalTokens={totalBalance}
      lockedTokens={lockedBalance}
      token={nativeToken}
      colony={colony}
      walletAddress={walletAddress}
      isPendingBalanceZero={isPendingBalanceZero}
    >
      {({ isOpen, toggle, ref }) => (
        <>
          <button
            type="button"
            className={styles.tokens}
            onClick={toggle}
            ref={ref}
            data-test={dataTest}
          >
            <Tooltip
              placement="bottom-start"
              trigger={!isOpen ? 'hover' : null}
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage {...MSG.tooltip} />
                </div>
              }
              popperOptions={{
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-8, 8],
                    },
                  },
                ],
              }}
            >
              <UserTokenActivationDisplay
                {...{ nativeToken, inactiveBalance, totalBalance }}
              />
            </Tooltip>
          </button>
        </>
      )}
    </TokenActivationPopover>
  );
};

UserTokenActivationButton.displayName = displayName;
export default UserTokenActivationButton;
