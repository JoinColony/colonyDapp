import { Colony } from '~data/index';

import { BatchDataItem } from './types';

export const calculateBatch = (colony: Colony, data?: BatchDataItem[]) => {
  if (!data) {
    return null;
  }
  const { tokens: colonyTokens } = colony || {};

  const amount = data
    .filter((item) => !!item.token && !!item.amount)
    .reduce((acc, item) => {
      if (item.token in acc) {
        return { ...acc, [item.token]: acc[item.token] + Number(item.amount) };
      }
      return { ...acc, [item.token]: Number(item.amount) };
    }, {});

  const tokens = Object.entries(amount || {})
    ?.map(([tokenId, tokenValue]) => {
      const token = colonyTokens?.find((tokenItem) => tokenItem.id === tokenId);

      if (!token) {
        return undefined;
      }

      return {
        value: Number(tokenValue),
        token,
      };
    })
    .filter((item) => !!item);

  const recipientsCount = data.filter((item) => !!item.recipient).length;

  return {
    amount,
    tokens,
    recipientsCount,
  };
};
