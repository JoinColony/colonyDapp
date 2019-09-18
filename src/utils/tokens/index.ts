import BigNumber from 'bn.js';

import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';

export const getTokenBalanceFromReference = <
  T extends ColonyTokenReferenceType | UserTokenReferenceType
>(
  tokenReference: T,
  domainId: T extends ColonyTokenReferenceType ? number : undefined,
): BigNumber => {
  let balance: BigNumber | number = 0;
  if ('balances' in tokenReference) {
    balance = (tokenReference as ColonyTokenReferenceType).balances[domainId];
  }
  if ('balance' in tokenReference) {
    balance = (tokenReference as UserTokenReferenceType).balance;
  }
  return new BigNumber(balance);
};
