import { nanoid } from 'nanoid';

import { Colony } from '~data/index';

import { Recipient as RecipientType } from './Payments/types';

export const getRecipientTokens = (
  recipient: RecipientType,
  colony?: Colony,
) => {
  const { value } = recipient || {};
  const { tokens: colonyTokens } = colony || {};
  const calculatedTokens = value?.map(({ amount, tokenAddress }) => {
    const token = colonyTokens?.find(
      (tokenItem) => tokenAddress && tokenItem.address === tokenAddress,
    );

    return {
      amount,
      token,
      key: nanoid(),
    };
  });

  return calculatedTokens;
};
