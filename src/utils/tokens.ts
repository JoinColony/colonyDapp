import BigNumber from 'bn.js';

import { TokenWithBalances } from '~data/index';

export const getBalanceFromToken = (
  token: TokenWithBalances | undefined,
  tokenDomainId = 0,
) => {
  let result;
  if (!token) return new BigNumber(0);
  if ('balances' in token) {
    const domainBalance = token.balances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('balance' in token) {
    result = token.balance;
  } else {
    result = 0;
  }
  return new BigNumber(result);
};
