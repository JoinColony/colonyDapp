import React from 'react';

import { ROOT_DOMAIN } from '~constants';
import CardList from '~core/CardList';
import { Address } from '~types/index';
import { ColonyTokens, UserTokens } from '~data/index';

import TokenCard from './TokenCard';
import styles from './TokenList.css';
import { SpinnerLoader } from '~core/Preloaders';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface Appearance {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols;
}

type ColonyOrUserToken = ColonyTokens[0] | UserTokens[0];

interface Props {
  appearance?: Appearance;
  domainId?: number | string;
  isLoading: boolean;
  nativeTokenAddress?: Address;
  tokens: ColonyOrUserToken[];
}

const displayName = 'admin.Tokens.TokenList';

const TokenList = ({
  appearance,
  domainId = ROOT_DOMAIN,
  isLoading,
  nativeTokenAddress,
  tokens,
}: Props) => (
  <div className={styles.tokenCardContainer}>
    <CardList appearance={appearance}>
      {isLoading && <SpinnerLoader appearance={{ size: 'large' }} />}
      {tokens.map(token => (
        <div key={token.address}>
          {'balances' in token && (
            <TokenCard
              domainId={domainId}
              nativeTokenAddress={nativeTokenAddress}
              token={token}
            />
          )}
          {'balance' in token && (
            <TokenCard domainId={domainId} token={token} />
          )}
        </div>
      ))}
    </CardList>
  </div>
);

TokenList.displayName = displayName;

export default TokenList;
