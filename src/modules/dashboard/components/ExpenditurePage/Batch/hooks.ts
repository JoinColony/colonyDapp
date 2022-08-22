import { useMemo } from 'react';
import { Colony, useMembersSubscription } from '~data/index';
import { BatchDataItem } from './types';

export const useCalculateBatchPayment = (
  colony: Colony,
  data?: BatchDataItem[],
) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });

  return useMemo(() => {
    if (!data) {
      return null;
    }
    const { tokens: colonyTokens } = colony || {};

    const validatedData = data.map(({ recipient, amount, token }) => {
      const correctRecipient = colonyMembers?.subscribedUsers.find(
        (user) => user.id === recipient,
      );
      const correctToken = colonyTokens?.find(
        (tokenItem) => tokenItem.id === token,
      );
      return {
        recipient: correctRecipient ? recipient : undefined,
        amount,
        token: correctToken || undefined,
      };
    });

    const filteredData = data.filter((item) => {
      const correctRecipient = colonyMembers?.subscribedUsers.find(
        (user) => user.id === item.recipient,
      );
      const correctToken = colonyTokens?.find(
        (tokenItem) => tokenItem.id === item.token,
      );
      return !!item.amount && correctRecipient && correctToken;
    });

    const amount = filteredData.reduce((acc, item) => {
      if (item.token in acc) {
        return {
          ...acc,
          [item.token]: acc[item.token] + Number(item.amount),
        };
      }
      return { ...acc, [item.token]: Number(item.amount) };
    }, {});

    const tokens = Object.entries(amount || {})?.map(
      ([tokenId, tokenValue]) => {
        const token = colonyTokens?.find(
          (tokenItem) => tokenItem.id === tokenId,
        );

        return {
          value: Number(tokenValue),
          token,
        };
      },
    );

    return {
      tokens,
      recipientsCount: filteredData.length,
      invalidRows: data.length !== filteredData.length,
      validatedData,
    };
  }, [data, colony, colonyMembers]);
};
