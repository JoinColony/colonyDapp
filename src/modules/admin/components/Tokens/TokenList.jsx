/* @flow */
import React from 'react';
import { List } from 'immutable';

import type { TokenRecord } from '~immutable';

import CardList from '~core/CardList';

import TokenCard from './TokenCard.jsx';

import styles from './TokenList.css';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type Appearance = {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols,
};

type Props = {
  appearance?: Appearance,
  tokens: List<TokenRecord>,
};

const TokenList = ({ tokens, appearance }: Props) => (
  <div className={styles.tokenCardContainer}>
    <CardList appearance={appearance}>
      {tokens
        .filter(token => token.isEnabled)
        .map(token => (
          <TokenCard key={token.address} token={token} />
        ))}
    </CardList>
  </div>
);

export default TokenList;
