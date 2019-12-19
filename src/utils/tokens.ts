import BigNumber from 'bn.js';

import { ColonyTokens, TokenWithBalances } from '~data/index';

export const getBalanceFromToken = (
  token: TokenWithBalances | undefined,
  tokenDomainId = 0,
) => {
  let balance;
  if (!token) return new BigNumber(0);
  if ('balances' in token) {
    const balanceObj = token.balances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    balance = balanceObj ? balanceObj.balance : 0;
  } else if ('balance' in token) {
    balance = token.balance;
  } else {
    balance = 0;
  }
  return new BigNumber(balance);
};

export const getNativeTokenAddress = (tokens: ColonyTokens) => {
  const nativeToken = tokens.find(({ isNative }) => isNative);
  return nativeToken && nativeToken.address;
};
