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

interface Props {
  appearance?: Appearance;
  domainId?: number;
  tokens: Array<ColonyTokenReferenceType | UserTokenReferenceType>;
}

const TokenList = ({ domainId, tokens, appearance }: Props) => (
  <div className={styles.tokenCardContainer}>
    <CardList appearance={appearance}>
      {tokens.map(token => (
        <TokenCard domainId={domainId} key={token.address} token={token} />
      ))}
    </CardList>
  </div>
);

export default TokenList;
