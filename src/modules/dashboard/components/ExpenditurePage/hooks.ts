import { useCallback, useMemo } from 'react';
import minBy from 'lodash/minBy';
import { nanoid } from 'nanoid';
import { uniqBy } from 'lodash';

import { Token } from '~data/index';
import { Recipient as RecipientType } from './Payments/types';

export interface TokenWithAmount {
  amount?: string;
  token?: Token;
}

export interface Recipient extends Omit<RecipientType, 'value'> {
  value?: TokenWithAmount[];
}

export const useCalculateTokens = (recipients?: Recipient[]) => {
  const basicTokens = useMemo(() => {
    if (!recipients) {
      return undefined;
    }

    const allTokens = recipients?.reduce((acc, recipient) => {
      if (!recipient.value) {
        return acc;
      }
      return [...acc, ...recipient.value];
    }, []);

    return uniqBy(allTokens, 'token.id').map((token) => ({
      ...token,
      amount: 0,
      key: nanoid(),
    }));
  }, [recipients]);

  const calculateTokens = useCallback(
    (recipientsArr?: Recipient[]) => {
      if (!recipientsArr || recipientsArr.length === 0) {
        return basicTokens;
      }
      const allTokens = recipientsArr?.reduce((acc, recipient) => {
        if (!recipient.value) {
          return acc;
        }
        return [...acc, ...recipient.value];
      }, []);

      const result = allTokens?.reduce((acc, token) => {
        const accIndex = acc?.findIndex(
          (accToken) => accToken?.token?.id === token?.token?.id,
        );

        if (accIndex !== undefined) {
          return acc?.map((accToken, index) => {
            if (index === accIndex) {
              return {
                ...accToken,
                amount: accToken.amount + Number(token.amount),
                key: nanoid(),
              };
            }
            return accToken;
          });
        }
        return acc;
      }, basicTokens);

      return result;
    },
    [basicTokens],
  );

  const findNextClaim = useCallback((recipientsArr?: Recipient[]) => {
    const futureTokens = recipientsArr?.filter(
      (recipient) => recipient.claimDate && !recipient.claimed,
    );

    const nextClaimableRecipient = minBy(
      futureTokens,
      (recipient) => recipient.claimDate,
    );

    return {
      claimDate: nextClaimableRecipient?.claimDate,
      claimed: nextClaimableRecipient?.claimed,
    };
  }, []);

  const totalClaimable = calculateTokens(recipients);

  const claimableNow = calculateTokens(
    recipients?.filter((recipient) => {
      const res =
        recipient.claimDate &&
        recipient.claimDate < new Date().getTime() &&
        !recipient.claimed;
      return res;
    }),
  );

  const claimed = calculateTokens(
    recipients?.filter((recipient) => recipient.claimed),
  );

  const nextClaim = findNextClaim(recipients);

  const buttonIsActive =
    claimableNow &&
    claimableNow.reduce((acc, curr) => acc + Number(curr.amount), 0) > 0;

  return {
    totalClaimable,
    claimableNow,
    claimed,
    nextClaim,
    buttonIsActive,
  };
};
