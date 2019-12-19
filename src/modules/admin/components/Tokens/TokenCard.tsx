import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Card from '~core/Card';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import CopyableAddress from '~core/CopyableAddress';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { ColonyTokens, UserTokens } from '~data/index';
import { getBalanceFromToken } from '~utils/tokens';

import { tokenIsETH, tokenBalanceIsNotPositive } from '../../../core/checks';

import styles from './TokenCard.css';

interface Props {
  token: ColonyTokens[0] | UserTokens[0];
  domainId: number;
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

const TokenCard = ({ domainId, token }: Props) => {
  const balance = getBalanceFromToken(token, domainId);

  return (
    <Card key={token.address} className={styles.main}>
      <div className={styles.cardHeading}>
        <TokenIcon
          token={token}
          name={token.details.name || undefined}
          size="xs"
        />
        <div className={styles.tokenSymbol}>
          {token.details.symbol ? (
            token.details.symbol
          ) : (
            <>
              <FormattedMessage {...MSG.unknownToken} />
              <CopyableAddress>{token.address}</CopyableAddress>
            </>
          )}
          {'isNative' in token && (token as ColonyTokens[0]).isNative && (
            <span className={styles.nativeTokenText}>
              <FormattedMessage {...MSG.nativeToken} />
            </span>
          )}
        </div>
      </div>
      <div
        className={
          tokenBalanceIsNotPositive(token, domainId)
            ? styles.balanceNotPositive
            : styles.balanceContent
        }
      >
        <Numeral
          className={styles.balanceNumeral}
          integerSeparator=""
          unit={token.details.decimals ? token.details.decimals : 18}
          value={balance || 0}
        />
      </div>
      <div className={styles.cardFooter}>
        {tokenIsETH(token) && (
          <EthUsd className={styles.ethUsdText} value={balance || 0} />
        )}
      </div>
    </Card>
  );
};

TokenCard.displayName = displayName;

export default TokenCard;
