/* @flow */

import React from 'react';

import type { TokenRecord } from '~immutable';

import Card from '~core/Card';
import EthUsd from '~core/EthUsd';

import styles from './TokenCard.css';

type Props = {
  token: TokenRecord,
};

const displayName = 'admin.Tokens.TokenCard';

const TokenCard = ({
  token: {
    address,
    balance,
    isEth,
    isNative,
    isNotPositive,
    icon,
    name,
    symbol,
  },
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
        isNotPositive ? styles.balanceNotPositive : styles.balanceContent
      }
    >
      {balance.toFixed(2)}
    </div>
    <div className={styles.cardFooter}>
      {isEth && <EthUsd value={balance} decimals={3} />}
    </div>
  </Card>
);

TokenCard.displayName = displayName;

export default TokenCard;
