import React from 'react';
import { BigNumber } from 'ethers/utils';
import classnames from 'classnames';

import { getFormattedTokenValue } from '~utils/tokens';
import Numeral from '~core/Numeral';
import { UserToken } from '~data/generated';

import styles from './UserTokenActivationButton.css';

const displayName =
  'users.UserTokenActivationButton.UserTokenActivationDisplay';

interface Props {
  nativeToken?: UserToken;
  inactiveBalance: BigNumber;
  totalBalance: BigNumber;
}

const UserTokenActivationDisplay = ({
  nativeToken,
  inactiveBalance,
  totalBalance,
}: Props) => {
  const formattedTotalBalance = getFormattedTokenValue(
    totalBalance,
    nativeToken?.decimals,
  );

  return (
    <div>
      <span
        className={classnames(styles.dot, {
          [styles.dotInactive]: inactiveBalance.gt(0) || totalBalance.isZero(),
        })}
      />
      <Numeral value={formattedTotalBalance} suffix={nativeToken?.symbol} />
    </div>
  );
};

UserTokenActivationDisplay.displayName = displayName;
export default UserTokenActivationDisplay;
