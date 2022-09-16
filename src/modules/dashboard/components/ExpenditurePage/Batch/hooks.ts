import { uniqBy } from 'lodash';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useState } from 'react';
import apolloClient from '~context/apolloClient';
import {
  Colony,
  Token,
  TokenDocument,
  TokenQuery,
  TokenQueryVariables,
  useMembersSubscription,
} from '~data/index';

import { BatchDataItem } from './types';

export const useCalculateBatchPayment = (
  colony: Colony,
  data?: BatchDataItem[],
) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });
  const [uniqTokens, setUniqTokens] = useState<
    (
      | Pick<
          Token,
          'symbol' | 'id' | 'address' | 'iconHash' | 'decimals' | 'name'
        >
      | undefined
    )[]
  >();

  useEffect(() => {
    const fetchTokens = async () => {
      const uniq = uniqBy(data, 'token');
      const tokensData = await Promise.all(
        uniq
          .map(async ({ token }) => {
            try {
              const { data: tokenData } = await apolloClient.query<
                TokenQuery,
                TokenQueryVariables
              >({
                query: TokenDocument,
                variables: { address: token },
              });
              return tokenData && tokenData.token;
            } catch (error) {
              return undefined;
            }
          })
          .filter((token) => !!token),
      );
      setUniqTokens(tokensData);
    };
    fetchTokens();
  }, [data]);

  return useMemo(() => {
    if (!data) {
      return null;
    }

    const validatedData = data.map(({ recipient, amount, token }) => {
      const correctRecipient = colonyMembers?.subscribedUsers.find(
        (user) => user.id === recipient,
      );
      const correctToken = uniqTokens?.find(
        (tokenItem) => tokenItem?.id === token,
      );
      return {
        id: nanoid(),
        recipient,
        amount,
        token: correctToken || undefined,
        error: !correctRecipient || !correctToken,
      };
    });

    const filteredData = data.filter((item) => {
      const correctRecipient = colonyMembers?.subscribedUsers.find(
        (user) => user.id === item.recipient,
      );
      const correctToken = uniqTokens?.find(
        (tokenItem) => tokenItem?.id === item.token,
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
        const token = uniqTokens?.find(
          (tokenItem) => tokenItem?.id === tokenId,
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
  }, [data, colonyMembers, uniqTokens]);
};
