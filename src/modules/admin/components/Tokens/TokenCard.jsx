/* @flow */

import React from 'react';

import type { TokenReferenceType, TokenType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import Card from '~core/Card';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import CopyableAddress from '~core/CopyableAddress';
import TokenIcon from '~dashboard/HookedTokenIcon';

import { tokenIsETH, tokenBalanceIsNotPositive } from '../../../core/checks';

import { tokenFetcher } from '../../../dashboard/fetchers';

import styles from './TokenCard.css';

type Props = {|
  token: TokenReferenceType,
|};

const displayName = 'admin.Tokens.TokenCard';

const TokenCard = ({
  token: { address, isNative, balance },
  token: tokenReference,
}: Props) => {
  const { data: token } = useDataFetcher<TokenType>(
    tokenFetcher,
    [address],
    [address],
  );
  // balance is fetched seperately to rest of token
  return token && balance !== undefined ? (
    <Card key={address} className={styles.main}>
      <div className={styles.cardHeading}>
        <TokenIcon token={tokenReference} name={token.name} size="xs" />
        <div className={styles.tokenSymbol}>
          {token.symbol || (
            <>
              Unknown Token<CopyableAddress>{address}</CopyableAddress>
            </>
          )}
          {isNative && <span>*</span>}
        </div>
      </div>
      <div
        className={
          tokenBalanceIsNotPositive(tokenReference)
            ? styles.balanceNotPositive
            : styles.balanceContent
        }
      >
        <Numeral
          className={styles.balanceNumeral}
          integerSeparator=""
          truncate={2}
          unit={token.decimals || 18}
          value={balance || 0}
        />
      </div>
      <div className={styles.cardFooter}>
        {tokenIsETH(token) && (
          <EthUsd
            className={styles.ethUsdText}
            value={balance || 0}
            truncate={3}
          />
        )}
      </div>
    </Card>
  ) : (
    <SpinnerLoader />
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
