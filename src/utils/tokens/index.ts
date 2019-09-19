import BigNumber from 'bn.js';

import {
  ColonyTokenReferenceType,
  UserTokenReferenceType,
} from '~immutable/index';

export const getTokenBalanceFromReference = <
  T extends ColonyTokenReferenceType | UserTokenReferenceType
>(
  tokenReference: T,
  domainId: T extends ColonyTokenReferenceType ? number : never,
): BigNumber => {
  let balance: BigNumber | number = 0;
  if ('balances' in tokenReference) {
    const { balances } = tokenReference as ColonyTokenReferenceType;
    balance = balances ? balances[domainId] : balance;
  }
  if ('balance' in tokenReference) {
    balance = (tokenReference as UserTokenReferenceType).balance || balance;
  }
  return new BigNumber(balance);
};
