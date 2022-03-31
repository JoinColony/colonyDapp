import React from 'react';

import Numeral from '~core/Numeral';
import IconTooltip from '~core/IconTooltip';
import { TokenBalancesForDomainsQuery } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyFunding.css';

interface Props {
  currentDomainId: number;
  token: TokenBalancesForDomainsQuery['tokens'][0];
  isTokenNative?: boolean;
  isNativeTokenLocked?: boolean;
}

const displayName = 'dashboard.ColonyHome.ColonyFunding.TokenItem';

const TokenItem = ({
  currentDomainId,
  token: { balances, decimals, symbol },
  isTokenNative,
  isNativeTokenLocked,
}: Props) => {
  const domainBalance = balances.find(
    ({ domainId }) => domainId === currentDomainId,
  );
  const balance = domainBalance && domainBalance.amount;

  return typeof balance === 'undefined' ? null : (
    <div className={styles.tokenItem}>
      <span
        className={styles.tokenValue}
        data-test={isTokenNative ? 'colonyFundingNativeTokenValue' : null}
      >
        <Numeral
          unit={getTokenDecimalsWithFallback(decimals)}
          value={balance}
        />
      </span>
      <span className={styles.tokenSymbol}>
        <span>{symbol}</span>
        {isTokenNative && isNativeTokenLocked && (
          <IconTooltip
            icon="lock"
            tooltipText={{ id: 'tooltip.lockedToken' }}
            className={styles.tokenLockWrapper}
            appearance={{ size: 'small' }}
            dataTest="lockIconTooltip"
          />
        )}
      </span>
    </div>
  );
};

TokenItem.displayName = displayName;

export default TokenItem;
