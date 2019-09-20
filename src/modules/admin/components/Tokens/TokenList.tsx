import React from 'react';

import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';
import CardList from '~core/CardList';
import TokenCard from './TokenCard';
import styles from './TokenList.css';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface Appearance {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols;
}

interface Props<T> {
  appearance?: Appearance;
  domainId?: number;
  tokens: T[];
}

const displayName = 'admin.Tokens.TokenList';

const TokenList = <
  T extends ColonyTokenReferenceType | UserTokenReferenceType
>({
  domainId = 1,
  tokens,
  appearance,
}: Props<T>) => (
  <div className={styles.tokenCardContainer}>
    <CardList appearance={appearance}>
      {tokens.map(token => (
        <div key={token.address}>
          {'balances' in token && (
            <TokenCard
              domainId={domainId}
              token={token as ColonyTokenReferenceType}
            />
          )}
          {'balance' in token && (
            <TokenCard
              domainId={domainId}
              token={token as UserTokenReferenceType}
            />
          )}
        </div>
      ))}
    </CardList>
  </div>
);

TokenList.displayName = displayName;

export default TokenList;
