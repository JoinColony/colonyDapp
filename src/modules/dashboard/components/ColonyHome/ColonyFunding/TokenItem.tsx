import React from 'react';

import Numeral from '~core/Numeral';
import { TokenBalancesForDomainsQuery } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

interface Props {
  currentDomainId: number;
  token: TokenBalancesForDomainsQuery['tokens'][0];
}

const displayName = 'dashboard.ColonyHome.ColonyFunding.TokenItem';

const TokenItem = ({
  currentDomainId,
  token: { balances, decimals, symbol },
}: Props) => {
  const domainBalance = balances.find(
    ({ domainId }) => domainId === currentDomainId,
  );
  const balance = domainBalance && domainBalance.amount;
  return typeof balance === 'undefined' ? null : (
    <Numeral
      unit={getTokenDecimalsWithFallback(decimals)}
      value={balance}
      suffix={` ${symbol}`}
    />
  );
};

TokenItem.displayName = displayName;

export default TokenItem;
