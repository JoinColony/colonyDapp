import React from 'react';

import { TokenType, ColonyTokenReferenceType } from '~immutable/index';

import Numeral from '~core/Numeral';
import { getTokenBalanceFromReference } from '~utils/tokens';

interface Props {
  currentDomainId: number;
  token: TokenType;
  tokenReference?: ColonyTokenReferenceType;
}

const displayName = 'dashboard.ColonyHome.ColonyFunding.TokenItem';

const TokenItem = ({
  currentDomainId,
  token: { decimals, symbol },
  tokenReference,
}: Props) => {
  const balance = tokenReference
    ? getTokenBalanceFromReference(tokenReference, currentDomainId)
    : undefined;
  return typeof balance === 'undefined' ? null : (
    <li>
      <Numeral unit={decimals} value={balance} suffix={` ${symbol}`} />
    </li>
  );
};

TokenItem.displayName = displayName;

export default TokenItem;
