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
      <Numeral
        unit={getTokenDecimalsWithFallback(decimals)}
        value={balance}
        suffix={` ${symbol}`}
      />
      {isTokenNative && isNativeTokenLocked && (
        <IconTooltip
          icon="lock"
          tooltipText={{ id: 'dashboard.lockedTokenTooltip' }}
          className={styles.tokenLockWrapper}
          iconSize="12px"
        />
      )}
    </div>
  );
};

TokenItem.displayName = displayName;

export default TokenItem;
