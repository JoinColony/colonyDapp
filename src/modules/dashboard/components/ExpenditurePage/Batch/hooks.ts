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
} from '~data/index';
import { AddressElements, splitAddress } from '~utils/strings';

import { BatchDataItem } from './types';

export const useCalculateBatchPayment = (
  colony: Colony,
  data?: BatchDataItem[],
) => {
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
      const correctRecipient: AddressElements | Error = splitAddress(recipient);
      const correctToken = uniqTokens?.find(
        (tokenItem) => tokenItem?.id === token,
      );
      return {
        id: nanoid(),
        recipient,
        amount,
        token: correctToken || undefined,
        error: correctRecipient instanceof Error || !correctToken,
      };
    });

    const filteredData = data.filter((item) => {
      const correctRecipient: AddressElements | Error = splitAddress(
        item.recipient,
      );
      const correctToken = uniqTokens?.find(
        (tokenItem) => tokenItem?.id === item.token,
      );
      return (
        !!item.amount && !(correctRecipient instanceof Error) && correctToken
      );
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
  }, [data, uniqTokens]);
};
