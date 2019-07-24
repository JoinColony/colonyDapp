/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

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

const MSG = defineMessages({
  unknownToken: {
    id: 'admin.TokenCard.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

const TokenCard = ({
  token: { address, isNative, balance },
  token: tokenReference,
}: Props) => {
  const { data: token, isFetching } = useDataFetcher<TokenType>(
    tokenFetcher,
    [address],
    [address],
  );

  // The balance is fetched seperately to the rest of the token.
  if (!address || isFetching || balance === undefined) {
    return <SpinnerLoader />;
  }

  // Even if the token didn't fetch, the card should still be shown,
  // because the address and balance are known.
  return (
    <Card key={address} className={styles.main}>
      <div className={styles.cardHeading}>
        <TokenIcon
          token={tokenReference}
          name={token ? token.name : undefined}
          size="xs"
        />
        <div className={styles.tokenSymbol}>
          {token ? (
            token.symbol
          ) : (
            <>
              <FormattedMessage {...MSG.unknownToken} />
              <CopyableAddress>{address}</CopyableAddress>
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
          unit={token ? token.decimals : 18}
          value={balance || 0}
        />
      </div>
      <div className={styles.cardFooter}>
        {tokenIsETH(tokenReference) && (
          <EthUsd
            className={styles.ethUsdText}
            value={balance || 0}
            truncate={3}
          />
        )}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
