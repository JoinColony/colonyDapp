import React from 'react';

import Numeral from '~core/Numeral';
import { FullColonyFragment } from '~data/index';

interface Props {
  currentDomainId: number;
  token: FullColonyFragment['tokens'][0];
}

const displayName = 'dashboard.ColonyHome.ColonyFunding.TokenItem';

const TokenItem = ({
  currentDomainId,
  token: {
    balances,
    details: { decimals, symbol },
  },
}: Props) => {
  const domainBalance = balances.find(
    ({ domainId }) => domainId === currentDomainId,
  );
  const balance = domainBalance && domainBalance.amount;
  return typeof balance === 'undefined' ? null : (
    <li>
      <Numeral unit={decimals || 18} value={balance} suffix={` ${symbol}`} />
    </li>
  );
};

TokenItem.displayName = displayName;

export default TokenItem;
