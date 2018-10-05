/* @flow */
import React from 'react';

import type { Token } from './types';

import Card from '~core/Card';
import Icon from '~core/Icon';

import styles from './TokenCard.css';

type Props = {
  token: Token,
};

const displayName = 'dashboard.ColonyTokenAdmin.TokenCard';

const TokenCard = ({
  token: { id: tokenId, icon, tokenSymbol, isNative, balance },
}: Props) => {
  const isEth = tokenSymbol.toLowerCase() === 'eth';
  return (
    <Card key={tokenId} className={styles.main}>
      <div className={styles.cardHeading}>
        {!!icon && (
          <div className={styles.iconContainer}>
            <Icon
              name="metamask"
              title={tokenSymbol}
              appearance={{ size: 'medium' }}
            />
          </div>
        )}
        <div className={styles.tokenSymbol}>
          {tokenSymbol}
          {isNative && <span>*</span>}
        </div>
      </div>
      <div className={styles.balanceContent}>{balance}</div>
      <div className={styles.cardFooter}>
        {isEth && <span>~ 201.34 USD</span>}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
