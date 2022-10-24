import React, { useMemo } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';

import { Colony } from '~data/index';
import { ExpenditureTypes, ValuesType } from '~pages/ExpenditurePage/types';

import ClaimFunds from './ClaimFunds';
import { ClaimData, TokenData } from './types';
import { getClaimData } from './utils';

const displayName = 'dashboard.ExpenditurePage.Stages.ClaimFundsOther';

const MSG = defineMessages({
  now: {
    id: 'dashboard.ExpenditurePage.Stages.ClaimFundsOther.now',
    defaultMessage: 'Now',
  },
});

export type TokensAmount = Record<string, number>;

interface Props {
  buttonAction?: () => void;
  buttonText?: string | MessageDescriptor;
  formValues: ValuesType;
  colony?: Colony;
  isDisabled?: boolean;
}

const ClaimFundsOther = ({
  buttonAction,
  buttonText,
  formValues,
  colony,
  isDisabled,
}: Props) => {
  const tokens = useMemo(() => {
    const expenditureType = formValues.expenditure;
    switch (expenditureType) {
      case ExpenditureTypes.Split: {
        const { tokenAddress, value } = formValues.split?.amount || {};
        const token = colony?.tokens?.find(
          (tokenItem) => tokenAddress && tokenItem.address === tokenAddress,
        );

        const tokenData = token && {
          amount: Number(value) || 0,
          token,
          key: nanoid(),
        };

        return getClaimData(tokenData);
      }
      case ExpenditureTypes.Staged: {
        const { tokenAddress, value } = formValues.staged?.amount || {};
        const token = colony?.tokens?.find(
          (tokenItem) => tokenAddress && tokenItem.address === tokenAddress,
        );

        const tokenData = token && {
          amount: Number(value) || 0,
          token,
          key: nanoid(),
        };

        return getClaimData(tokenData);
      }
      case ExpenditureTypes.Batch: {
        const batchTokens = formValues.batch?.value;
        const data = batchTokens
          ?.map(
            (batchTokenItem) =>
              batchTokenItem?.token && {
                token: batchTokenItem.token,
                amount: Number(batchTokenItem?.value) || 0,
                key: nanoid(),
              },
          )
          .filter((item) => !!item);
        const tokensData = isEmpty(data) ? undefined : data;

        return getClaimData(tokensData as TokenData[]);
      }
      default: {
        return undefined;
      }
    }
  }, [
    colony,
    formValues.batch,
    formValues.expenditure,
    formValues.split,
    formValues.staged,
  ]);

  return (
    <ClaimFunds
      buttonAction={buttonAction}
      buttonText={buttonText}
      claimData={tokens as Omit<ClaimData, 'nextClaim'>}
      nextClaimLabel={<FormattedMessage {...MSG.now} />}
      isDisabled={isDisabled}
    />
  );
};

ClaimFundsOther.displayName = displayName;

export default ClaimFundsOther;
