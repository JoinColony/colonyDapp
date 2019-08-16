import { FormikBag } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import BigNumber from 'bn.js';

import { TokenType } from '~immutable/index';
import { Address } from '~types/index';

import { ActionForm } from '~core/Fields';

import { pipe, mapPayload, mergePayload, withKey } from '~utils/actions';
import { ActionTypes } from '~redux/index';

const MSG = defineMessages({
  errorAmountMin: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountMin',
    defaultMessage: 'Please enter an amount greater than 0.',
  },
  errorAmountNumeral: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountNumeral',
    defaultMessage: 'Please enter a number.',
  },
  errorAmountRequired: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountRequired',
    defaultMessage: 'Please enter an amount.',
  },
});

interface Props {
  children?: any;
  colonyAddress: Address;
  nativeToken: TokenType;
  onSuccess?: (result: any, bag: FormikBag<any, any>, values: any) => void;
}

const validationSchema = yup.object().shape({
  mintAmount: yup
    .number(MSG.errorAmountNumeral)
    .required(MSG.errorAmountRequired)
    .min(0.000000000000000001, MSG.errorAmountMin),
});

const TokenMintForm = ({
  children,
  onSuccess,
  nativeToken: { decimals },
  colonyAddress,
}: Props) => {
  const transform = useCallback(
    pipe(
      mapPayload(({ mintAmount: inputAmount }) => ({
        // shift by the token's decimals (or default of 18)
        amount: new BigNumber(moveDecimal(inputAmount, decimals || 18)),
      })),
      withKey(colonyAddress),
      mergePayload({ colonyAddress }),
    ),
    [decimals, colonyAddress],
  );

  return (
    <ActionForm
      initialValues={{
        mintAmount: 0,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_MINT_TOKENS}
      error={ActionTypes.COLONY_MINT_TOKENS_ERROR}
      success={ActionTypes.COLONY_MINT_TOKENS_SUBMITTED}
      onSuccess={onSuccess}
      transform={transform}
    >
      {children}
    </ActionForm>
  );
};

TokenMintForm.displayName = 'admin.Tokens.TokenMintDialog';

export default TokenMintForm;
