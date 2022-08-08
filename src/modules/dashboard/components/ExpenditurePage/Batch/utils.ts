import { Colony } from '~data/index';
import { BatchDataItem } from './types';

export const calculateBatch = (colony: Colony, data?: BatchDataItem[]) => {
  if (!data) {
    return null;
  }
  const { tokens: colonyTokens } = colony || {};

  const value = data
    .filter((item) => !!item.Recipient)
    .reduce((acc, item) => {
      if (item.Token in acc) {
        return { ...acc, [item.Token]: acc[item.Token] + Number(item.Value) };
      }
      return { ...acc, [item.Token]: Number(item.Value) };
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
      !!item.Recipient &&
      colonyTokens.find((token) => token.symbol === item.Token)
    );
  }).length;

  return {
    value,
    tokens,
    recipientsCount,
  };
};
