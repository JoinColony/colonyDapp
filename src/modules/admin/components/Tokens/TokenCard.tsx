import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';

import Card from '~core/Card';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import { SpinnerLoader } from '~core/Preloaders';
import CopyableAddress from '~core/CopyableAddress';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { useDataFetcher } from '~utils/hooks';
import { getTokenBalanceFromReference } from '~utils/tokens';

import { tokenIsETH, tokenBalanceIsNotPositive } from '../../../core/checks';

import { tokenFetcher } from '../../../dashboard/fetchers';

import styles from './TokenCard.css';

interface Props<T> {
  token: T;
  domainId: T extends ColonyTokenReferenceType ? string : never;
}

const displayName = 'admin.Tokens.TokenCard';

const MSG = defineMessages({
  nativeToken: {
    id: 'dashboard.TokenCard.nativeToken',
    defaultMessage: ' (Native Token)',
  },
  unknownToken: {
    id: 'admin.TokenCard.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

const TokenCard = <
  T extends ColonyTokenReferenceType | UserTokenReferenceType
>({
  domainId,
  token: { address },
  token: tokenReference,
}: Props<T>) => {
  const { data: token, isFetching } = useDataFetcher(
    tokenFetcher,
    [address],
    [address],
  );

  const balance = useMemo(
    () => getTokenBalanceFromReference<T>(tokenReference, domainId),
    [domainId, tokenReference],
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
          {'isNative' in tokenReference &&
            (tokenReference as ColonyTokenReferenceType).isNative && (
              <span className={styles.nativeTokenText}>
                <FormattedMessage {...MSG.nativeToken} />
              </span>
            )}
        </div>
      </div>
      <div
        className={
          tokenBalanceIsNotPositive(tokenReference, domainId)
            ? styles.balanceNotPositive
            : styles.balanceContent
        }
      >
        <Numeral
          className={styles.balanceNumeral}
          integerSeparator=""
          unit={token && token.decimals ? token.decimals : 18}
          value={balance || 0}
        />
      </div>
      <div className={styles.cardFooter}>
        {tokenIsETH(tokenReference) && (
          <EthUsd className={styles.ethUsdText} value={balance || 0} />
        )}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
