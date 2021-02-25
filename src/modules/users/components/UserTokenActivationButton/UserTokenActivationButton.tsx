import React from 'react';
import { bigNumberify } from 'ethers/utils';

import { TokenActivationPopover } from '~users/TokenActivation';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~core/Numeral';

import { UserLock, UserToken } from '~data/index';

import styles from './UserTokenActivationButton.css';

const displayName = 'users.UserTokenActivationButton';

interface Props {
  userLock: UserLock;
  nativeToken: UserToken;
}

const UserTokenActivationButton = ({ nativeToken, userLock }: Props) => {
  const inactiveBalance = bigNumberify(nativeToken?.balance || 0);

  const lockedBalance = bigNumberify(userLock?.totalObligation || 0);
  const lockContractBalance = bigNumberify(userLock?.balance || 0);
  const activeBalance = lockContractBalance.sub(lockedBalance);
  const totalBalance = inactiveBalance.add(activeBalance);

  return (
    <TokenActivationPopover
      activeTokens={activeBalance}
      inactiveTokens={lockedBalance}
      totalTokens={totalBalance}
      token={nativeToken}
      lockedTokens={lockedBalance}
    >
      {({ toggle, ref }) => (
        <>
          <button
            type="button"
            className={styles.tokens}
            onClick={toggle}
            ref={ref}
          >
            <span
              className={`${styles.dot} ${
                (inactiveBalance.gt(0) || totalBalance.isZero()) &&
                styles.dotInactive
              }`}
            />
            <Numeral
              suffix={` ${nativeToken?.symbol} `}
              unit={getTokenDecimalsWithFallback(nativeToken?.decimals)}
              value={totalBalance}
              truncate={3}
            />
          </button>
        </>
      )}
    </TokenActivationPopover>
  );
};

UserTokenActivationButton.displayName = displayName;

export default UserTokenActivationButton;
