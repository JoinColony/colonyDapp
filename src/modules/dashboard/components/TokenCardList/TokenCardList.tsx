import React from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import CardList from '~core/CardList';
import { ColonyTokens, UserTokens } from '~data/index';
import { Address } from '~types/index';

import TokenCard from '../TokenCard';

import styles from './TokenCardList.css';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface Appearance {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols;
}

type ColonyOrUserToken = ColonyTokens[0] | UserTokens[0];

interface Props {
  appearance?: Appearance;
  domainId?: number | string;
  nativeTokenAddress?: Address;
  tokens: ColonyOrUserToken[];
  nativeTokenLocked?: boolean;
}

const displayName = 'dashboard.TokenCardList';

const TokenCardList = ({
  appearance,
  domainId = ROOT_DOMAIN_ID,
  nativeTokenAddress,
  tokens,
  nativeTokenLocked,
}: Props) => (
  <div className={styles.tokenCardContainer}>
    <CardList appearance={appearance}>
      {tokens.map((token) => (
        <div key={token.address}>
          {'processedBalances' in token && (
            <TokenCard
              domainId={domainId}
              nativeTokenAddress={nativeTokenAddress}
              token={token}
              nativeTokenLocked={nativeTokenLocked}
            />
          )}
          {'balances' in token && (
            <TokenCard
              domainId={domainId}
              nativeTokenAddress={nativeTokenAddress}
              token={token}
              nativeTokenLocked={nativeTokenLocked}
            />
          )}
          {'balance' in token && (
            <TokenCard
              domainId={domainId}
              token={token}
              nativeTokenLocked={nativeTokenLocked}
            />
          )}
        </div>
      ))}
    </CardList>
  </div>
);

TokenCardList.displayName = displayName;

export default TokenCardList;
