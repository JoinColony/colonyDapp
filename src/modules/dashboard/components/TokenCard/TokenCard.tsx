import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Card from '~core/Card';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import CopyableAddress from '~core/CopyableAddress';
import InfoPopover from '~core/InfoPopover';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Address } from '~types/index';
import { ColonyTokens, UserTokens } from '~data/index';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { tokenIsETH, tokenBalanceIsNotPositive } from '../../../core/checks';

import styles from './TokenCard.css';
import IconTooltip from '~core/IconTooltip';

interface Props {
  // @todo use string or number (not both) everywhere for `domainId`
  domainId: number | string;
  nativeTokenAddress?: Address;
  token: ColonyTokens[0] | UserTokens[0];
  nativeTokenLocked?: boolean;
}

const displayName = 'dashboard.TokenCard';

const MSG = defineMessages({
  nativeToken: {
    id: 'dashboard.TokenCard.nativeToken',
    defaultMessage: ' (Native Token)',
  },
  unknownToken: {
    id: 'dashboard.TokenCard.unknownToken',
    defaultMessage: 'Unknown Token',
  },
});

const TokenCard = ({
  domainId,
  nativeTokenAddress,
  token,
  nativeTokenLocked = true,
}: Props) => {
  const balance = getBalanceFromToken(token, parseInt(domainId as string, 10));
  return (
    <Card key={token.address} className={styles.main}>
      <InfoPopover
        token={token}
        isTokenNative={token.address === nativeTokenAddress}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [[0, 0]],
              },
            },
          ],
        }}
      >
        <div className={styles.cardHeading}>
          <TokenIcon token={token} name={token.name || undefined} size="xs" />
          <div className={styles.tokenSymbol}>
            {token.symbol ? (
              <span>{token.symbol}</span>
            ) : (
              <>
                <FormattedMessage {...MSG.unknownToken} />
                <CopyableAddress>{token.address}</CopyableAddress>
              </>
            )}
            {token.address === nativeTokenAddress && nativeTokenLocked && (
              <IconTooltip
                icon="lock"
                tooltipText={{ id: 'tooltip.lockedToken' }}
                className={styles.tokenLockWrapper}
                appearance={{ size: 'tiny' }}
              />
            )}
            {token.address === nativeTokenAddress && (
              <span className={styles.nativeTokenText}>
                <FormattedMessage {...MSG.nativeToken} />
              </span>
            )}
          </div>
        </div>
      </InfoPopover>
      <div
        className={
          tokenBalanceIsNotPositive(token, parseInt(domainId as string, 10))
            ? styles.balanceNotPositive
            : styles.balanceContent
        }
      >
        <Numeral
          className={styles.balanceNumeral}
          unit={getTokenDecimalsWithFallback(token.decimals)}
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
