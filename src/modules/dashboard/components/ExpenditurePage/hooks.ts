import { useCallback } from 'react';
import minBy from 'lodash/minBy';

import { TokensFragment } from '~data/index';
import { Recipient as RecipientType } from './Payments/types';

export interface Token {
  amount?: string;
  token?: TokensFragment;
}

export interface Recipient extends Omit<RecipientType, 'value'> {
  value?: Token[];
}

export const hasSymbolKey = (obj: any): obj is { symbol: string } => {
  return Object.keys(obj).some((key) => key === 'symbol');
};

export const useCalculateTokens = (recipients?: Recipient[]) => {
  const calculateTokens = useCallback(
    (recipientsArr: Recipient[], initailAcc?: Record<string, number>) => {
      const allTokens = recipientsArr?.reduce((acc, recipient) => {
        if (!recipient.value) {
          return acc;
        }
        return [...acc, ...recipient.value];
      }, []);

      return allTokens?.reduce((accumulator, singleToken) => {
        const { token, amount: tokenAmount } = singleToken;
        if (!hasSymbolKey(token)) {
          return accumulator;
        }

        if (token.symbol in accumulator) {
          return {
            ...accumulator,
            [token?.symbol]: accumulator[token.symbol] + Number(tokenAmount),
          };
        }

        return { ...accumulator, [token.symbol]: Number(tokenAmount) };
      }, initailAcc || {});
    },
    [],
  );

  const findNextClaim = useCallback((recipientsArr?: Recipient[]) => {
    const futureTokens = recipientsArr?.filter(
      (recipient) => recipient.claimDate && !recipient.claimed,
    );

    return minBy(futureTokens, (recipient) => recipient.claimDate);
  }, []);

  const totalClaimable = recipients ? calculateTokens(recipients) : {};

  const pattern =
    typeof totalClaimable === 'object'
      ? Object.keys(totalClaimable).reduce(
          (acc, key) => ({ ...acc, [key]: 0 }),
          {},
        )
      : {};

  const claimableNow = calculateTokens(
    recipients?.filter((recipient) => {
      const res =
        recipient.claimDate &&
        recipient.claimDate < new Date().getTime() &&
        !recipient.claimed;
      return res;
    }) as any,
    pattern,
  );

  const claimed = calculateTokens(
    recipients?.filter((recipient) => recipient.claimed, {}) as any,
    pattern,
  );

  const nextClaim = findNextClaim(recipients);

  const buttonIsActive =
    typeof claimableNow === 'object' &&
    Object.values(claimableNow)?.some((value) => value > 0);

  return {
    totalClaimable,
    claimableNow,
    claimed,
    nextClaimableRecipient: nextClaim,
    buttonIsActive,
  };
};
