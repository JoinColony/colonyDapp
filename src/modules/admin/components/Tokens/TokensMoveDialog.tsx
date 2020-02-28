import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
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

const MSG = defineMessages({
  samePot: {
    id: 'admin.Tokens.TokensMoveDialog.samePot',
    defaultMessage: 'Cannot move to same domain pot',
  },
});

export interface FormValues {
  fromDomain?: string;
  toDomain?: string;
  amount: string;
  tokenAddress?: Address;
}

interface Props {
  cancel: () => void;
  close: (params: object) => void;
  colonyAddress: Address;
  toDomain?: number;
}

const displayName = 'admin.Tokens.TokensMoveDialog';

const TokensMoveDialog = ({
  colonyAddress,
  toDomain,
  cancel,
  close,
}: Props) => {
  const validationSchema = yup.object().shape({
    fromDomain: yup.number().required(),
    toDomain: yup
      .number()
      .notEqualTo(yup.ref('fromDomain'), () => MSG.samePot)
      .required(),
    amount: yup.string().required(),
    tokenAddress: yup
      .string()
      .address()
      .required(),
  });

  const { data: colonyTokensData } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const tokens = (colonyTokensData && colonyTokensData.colony.tokens) || [];
  const nativeTokenAddress =
    colonyTokensData && colonyTokensData.colony.nativeTokenAddress;

  const transform = useCallback(
    pipe(
      mapPayload(payload => {
        // Find the selected token's decimals
        const selectedToken = tokens.find(
          token => token.address === payload.tokenAddress,
        );
        const decimals = (selectedToken && selectedToken.decimals) || 18;

        // Convert amount string with decimals to BigInt (eth to wei)
        const amount = new BigNumber(moveDecimal(payload.amount, decimals));

        return {
          ...payload,
          colonyAddress,
          amount,
          fromDomain: parseInt(payload.fromDomain, 10),
          toDomain: parseInt(payload.toDomain, 10),
        };
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

TokensMoveDialog.displayName = displayName;

export default TokensMoveDialog;
