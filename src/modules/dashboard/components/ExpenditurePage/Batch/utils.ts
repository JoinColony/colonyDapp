import { Colony } from '~data/index';
import { BatchDataItem } from './types';

export const calculateBatch = (colony: Colony, data?: BatchDataItem[]) => {
  if (!data) {
    return null;
  }
  const { tokens: colonyTokens } = colony || {};

  const value = data
    .filter((item) => !!item.recipient)
    .reduce((acc, item) => {
      if (item.token in acc) {
        return { ...acc, [item.token]: acc[item.token] + Number(item.value) };
      }
      return { ...acc, [item.token]: Number(item.value) };
    }, {});

  const tokens = Object.entries(value || {})?.map(([tokenName, tokenValue]) => {
    const token = colonyTokens?.find(
      (tokenItem) => tokenItem.symbol === tokenName,
    );

    return {
      amount: tokenValue,
      token,
    };
  });

  const recipientsCount = data.filter((item) => {
    return (
      !!item.recipient &&
      colonyTokens.find((token) => token.symbol === item.token)
    );
  }).length;

  return {
    value,
    tokens,
    recipientsCount,
  };
};
