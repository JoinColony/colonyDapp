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

import {
  tokenIsETH,
  tokenBalanceIsNotPositive,
} from '../../../dashboard/checks';

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
  return token ? (
    <Card key={address} className={styles.main}>
      <div className={styles.cardHeading}>
        <TokenIcon token={tokenReference} name={token.name} />
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
          value={balance}
          decimals={2}
          integerSeparator=""
          unit="ether"
        />
      </div>
      <div className={styles.cardFooter}>
        {tokenIsETH(token) && <EthUsd value={balance} decimals={3} />}
      </div>
    </Card>
  ) : (
    <SpinnerLoader />
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
