/* @flow */
import React from 'react';

import type { Token } from './types';

import Card from '~core/Card';
import Icon from '~core/Icon';
import Numeral from '~core/Numeral';

import styles from './TokenCard.css';

type Props = {
  token: Token,
};

/*
 * TODO either implement or remove this. Also update required `Numeral` below.
 */
const getEthUsd = (/* ethValue: number */): number => 201.34;

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
        {isEth && (
          <Numeral value={getEthUsd(/* balance */)} prefix="~ " suffix=" USD" />
        )}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
