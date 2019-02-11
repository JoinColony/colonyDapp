/* @flow */

import React from 'react';

import type { TokenType } from '~immutable';

import Card from '~core/Card';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';

import {
  tokenIsETH,
  tokenBalanceIsNotPositive,
} from '../../../../immutable/utils';

import styles from './TokenCard.css';

type Props = {|
  token: TokenType,
|};

const displayName = 'admin.Tokens.TokenCard';

const TokenCard = ({
  token: { address, balance, isNative, icon, name, symbol },
  token,
}: Props) => (
  <Card key={address} className={styles.main}>
    <div className={styles.cardHeading}>
      {!!icon && (
        <div className={styles.iconContainer}>
          <img src={icon} alt={name} />
        </div>
      )}
      <div className={styles.tokenSymbol}>
        {symbol}
        {isNative && <span>*</span>}
      </div>
    </div>
    <div
      className={
        tokenBalanceIsNotPositive(token)
          ? styles.balanceNotPositive
          : styles.balanceContent
      }
    >
      <Numeral value={balance} decimals={2} integerSeparator="" unit="ether" />
    </div>
    <div className={styles.cardFooter}>
      {tokenIsETH(token) && <EthUsd value={balance} decimals={3} />}
    </div>
  </Card>
);

TokenCard.displayName = displayName;

export default TokenCard;
