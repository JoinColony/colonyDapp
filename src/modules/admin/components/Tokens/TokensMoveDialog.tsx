import React, { useCallback, useMemo } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import BigNumber from 'bn.js';

import { pipe, mapPayload, withKey } from '~utils/actions';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { useColonyTokensQuery } from '~data/index';

import DialogForm from './TokensMoveDialogForm';

export interface FormValues {
  fromDomain?: number;
  toDomain?: number;
  amount: string;
  tokenAddress?: Address;
}

interface Props {
  cancel: () => void;
  close: (params: object) => void;
  colonyAddress: Address;
  toDomain?: number;
}

const TokensMoveDialog = ({
  colonyAddress,
  toDomain,
  cancel,
  close,
}: Props) => {
  const validationSchema = yup.object().shape({
    fromDomain: yup.number().required(),
    toDomain: yup.number().required(),
    amount: yup.string().required(),
    tokenAddress: yup.string().required(),
  });

  const { data: colonyTokensData } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const tokens = (colonyTokensData && colonyTokensData.colony.tokens) || [];

  const nativeTokenAddress = useMemo(
    () => tokens.find(({ isNative }) => !!isNative),
    [tokens],
  );

  const transform = useCallback(
    pipe(
      mapPayload(payload => {
        // Find the selected token's decimals
        const selectedToken = tokens.find(
          token => token.address === payload.tokenAddress,
        );
        const decimals =
          (selectedToken && selectedToken.details.decimals) || 18;

        // Convert amount string with decimals to BigInt (eth to wei)
        const amount = new BigNumber(moveDecimal(payload.amount, decimals));

        return { ...payload, colonyAddress, amount };
      }),
      withKey(colonyAddress),
    ),
    [colonyAddress, tokens],
  );

  return (
    <ActionForm
      initialValues={{
        fromDomain: undefined,
        toDomain,
        amount: '',
        tokenAddress: nativeTokenAddress,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOVE_FUNDS_BETWEEN_POTS}
      error={ActionTypes.MOVE_FUNDS_BETWEEN_POTS_ERROR}
      // Close dialog immediately to give way for GasStation
      success={ActionTypes.MOVE_FUNDS_BETWEEN_POTS}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            colonyAddress={colonyAddress}
            cancel={cancel}
            tokens={tokens}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

TokensMoveDialog.displayName = 'admin.Tokens.TokensMoveDialog';

export default TokensMoveDialog;
