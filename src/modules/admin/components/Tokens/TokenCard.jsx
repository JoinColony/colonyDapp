/* @flow */

import React from 'react';
import { withProps } from 'recompose';

import type { TokenType } from '~types/token';

import Card from '~core/Card';
import EthUsd from '~core/EthUsd';

import styles from './TokenCard.css';

type InProps = {
  token: TokenType,
};

type Props = InProps & {
  isEth: boolean,
  isNotPositive: boolean,
};

const displayName = 'admin.Tokens.TokenCard';

const TokenCard = ({
  isEth,
  isNotPositive,
  token: { id: tokenId, tokenIcon, tokenName, tokenSymbol, isNative, balance },
}: Props) => (
  <Card key={tokenId} className={styles.main}>
    <div className={styles.cardHeading}>
      {!!tokenIcon && (
        <div className={styles.iconContainer}>
          <img src={tokenIcon} alt={tokenName} />
        </div>
      )}
      <div className={styles.tokenSymbol}>
        {tokenSymbol}
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

const enhance = withProps(({ token: { balance, tokenSymbol } }: InProps) => ({
  isEth: !!tokenSymbol && tokenSymbol.toLowerCase() === 'eth',
  isNotPositive: Number(balance) <= 0,
}));

export default enhance(TokenCard);
