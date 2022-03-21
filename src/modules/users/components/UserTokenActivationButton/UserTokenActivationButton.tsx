import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';

import { TokenActivationPopover } from '~users/TokenActivation';
import { getFormattedTokenValue } from '~utils/tokens';
import { Tooltip } from '~core/Popover';
import Numeral from '~core/Numeral';
import { FullColonyFragment, UserLock, UserToken } from '~data/index';
import { Address } from '~types/index';

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
  userLock: UserLock;
  nativeToken: UserToken;
  colony?: FullColonyFragment;
  walletAddress: Address;
}

const UserTokenActivationButton = ({
  nativeToken,
  userLock,
  colony,
  walletAddress,
}: Props) => {
  const inactiveBalance = bigNumberify(nativeToken?.balance || 0);

  const lockedBalance = bigNumberify(userLock?.totalObligation || 0);
  const activeBalance = bigNumberify(userLock?.activeTokens || 0);
  const totalBalance = inactiveBalance.add(activeBalance).add(lockedBalance);
  const isPendingBalanceZero = bigNumberify(
    userLock?.pendingBalance || 0,
  ).isZero();

  const formattedTotalBalance = getFormattedTokenValue(
    totalBalance,
    nativeToken.decimals,
  );

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
          >
            <Tooltip
              appearance={{ theme: 'dark', size: 'medium' }}
              placement="bottom"
              trigger={!isOpen ? 'hover' : 'disabled'}
              showArrow
              content={
                <div className={styles.tooltip}>
                  <FormattedMessage {...MSG.tooltip} />
                </div>
              }
            >
              <div>
                <span
                  className={`${styles.dot} ${
                    (inactiveBalance.gt(0) || totalBalance.isZero()) &&
                    styles.dotInactive
                  }`}
                />
                <Numeral
                  suffix={` ${nativeToken?.symbol} `}
                  value={formattedTotalBalance}
                />
              </div>
            </Tooltip>
          </button>
        </>
      )}
    </TokenActivationPopover>
  );
};

UserTokenActivationButton.displayName = displayName;

export default UserTokenActivationButton;
