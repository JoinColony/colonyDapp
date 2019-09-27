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

import { useColonyTokens } from '../../../dashboard/hooks/useColonyTokens';
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

  // Fetch colony tokens here since we need them for form submission
  const [colonyTokenRefs, colonyTokens] = useColonyTokens(colonyAddress);

  const nativeTokenAddress = useMemo(
    () =>
      (
        (colonyTokenRefs || []).find(({ isNative }) => !!isNative) || {
          address: undefined,
        }
      ).address,
    [colonyTokenRefs],
  );

  const transform = useCallback(
    pipe(
      mapPayload(payload => {
        // Find the selected token's decimals
        const { decimals: tokenDecimals } = (colonyTokens &&
          colonyTokens.find(
            token => token.address === payload.tokenAddress,
          )) || {
          decimals: undefined,
        };

        // Convert amount string with decimals to BigInt (eth to wei)
        const amount = new BigNumber(
          moveDecimal(payload.amount, tokenDecimals || 18),
        );

        return { ...payload, colonyAddress, amount };
      }),
      withKey(colonyAddress),
    ),
    [colonyAddress, colonyTokens],
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
            colonyTokens={colonyTokens}
            colonyTokenRefs={colonyTokenRefs}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

TokensMoveDialog.displayName = 'admin.Tokens.TokensMoveDialog';

export default TokensMoveDialog;
