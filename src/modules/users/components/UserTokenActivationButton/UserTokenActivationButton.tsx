import React from 'react';
import { bigNumberify } from 'ethers/utils';
import { defineMessages, FormattedMessage } from 'react-intl';

import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { Tooltip } from '~core/Popover';
import Numeral from '~core/Numeral';

import { UserLock, UserToken } from '~data/index';

import styles from './UserTokenActivationButton.css';

const MSG = defineMessages({
  inactiveTokens: {
    id: 'users.UserTokenActivationButton.inactiveTokens',
    defaultMessage: 'You have inactive tokens. 😢',
  },
  activeTokens: {
    id: 'users.UserTokenActivationButton.activeTokens',
    defaultMessage: 'All your tokens are activated! 💪',
  },
  zeroTokens: {
    id: 'users.UserTokenActivationButton.zeroTokens',
    defaultMessage: 'You don’t have any tokens! 😭',
  },
});

const displayName = 'users.UserTokenActivationButton';

interface Props {
  userLock: UserLock;
  nativeToken: UserToken;
  isOpen: boolean;
  onClick?: () => void;
}

const UserTokenActivationButton = ({
  nativeToken,
  userLock,
  isOpen,
  onClick,
}: Props) => {
  const inactiveBalance = bigNumberify(nativeToken?.balance || 0);

  const lockedBalance = bigNumberify(userLock?.totalObligation || 0);
  const lockContractBalance = bigNumberify(userLock?.balance || 0);
  const activeBalance = lockContractBalance.sub(lockedBalance);
  const totalBalance = inactiveBalance.add(activeBalance);
  const isInactive = inactiveBalance.gt(0) || totalBalance.isZero();

  let tooltipMessage = MSG.activeTokens;

  if (totalBalance.isZero()) tooltipMessage = MSG.zeroTokens;
  else if (inactiveBalance.gt(0)) tooltipMessage = MSG.inactiveTokens;

  return (
    <Tooltip
      placement="bottom"
      trigger="hover"
      showArrow={false}
      content={<FormattedMessage {...tooltipMessage} />}
    >
      <button
        type="button"
        onClick={onClick}
        className={isOpen ? styles.tokensActive : styles.tokens}
      >
        <span className={`${styles.dot} ${isInactive && styles.dotInactive}`} />
        <Numeral
          suffix={` ${nativeToken?.symbol} `}
          unit={getTokenDecimalsWithFallback(nativeToken?.decimals)}
          value={totalBalance}
          truncate={3}
        />
      </button>
    </Tooltip>
  );
};

UserTokenActivationButton.displayName = displayName;

export default UserTokenActivationButton;
