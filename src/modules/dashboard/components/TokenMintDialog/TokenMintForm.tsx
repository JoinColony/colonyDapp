import React, { DependencyList, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import { FormikBag } from 'formik';
import moveDecimal from 'move-decimal-point';
import * as yup from 'yup';

import { ActionForm } from '~core/Fields';
import { ColonyTokens, OneToken } from '~data/index';
import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { pipe, mapPayload, mergePayload, withKey } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

const MSG = defineMessages({
  errorAmountMin: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountMin',
    defaultMessage: 'Please enter an amount greater than 0.',
  },
  errorAmountRequired: {
    id: 'admin.Tokens.TokenMintDialog.errorAmountRequired',
    defaultMessage: 'Please enter an amount.',
  },
});

interface Props {
  children?: any;
  colonyAddress: Address;
  nativeToken: ColonyTokens[0] | OneToken;
  onSuccess?: (result: any, bag: FormikBag<any, any>, values: any) => void;
}

const validationSchema = yup.object().shape({
  justification: yup.string(),
  mintAmount: yup
    .number()
    .required(() => MSG.errorAmountRequired)
    .min(0.000000000000000001, () => MSG.errorAmountMin),
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
        amount: bigNumberify(
          moveDecimal(inputAmount, getTokenDecimalsWithFallback(decimals)),
        ),
      })),
      withKey(colonyAddress),
      mergePayload({ colonyAddress }),
    ),
    [decimals, colonyAddress] as DependencyList,
  );

  return (
    <ActionForm
      initialValues={{
        justification: '',
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
