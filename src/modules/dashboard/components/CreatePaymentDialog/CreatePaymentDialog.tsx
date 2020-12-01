import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import { bigNumberify } from 'ethers/utils';
import { useQuery } from '@apollo/client';

import { pipe, mapPayload, withKey } from '~utils/actions';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import { useColonyQuery, ColonySubscribedUsersDocument } from '~data/index';

import DialogForm from './CreatePaymentDialogForm';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

export interface FormValues {
  fromDomain?: string;
  toAssignee?: string;
  amount: string;
  tokenAddress?: Address;
  reason?: string;
}

interface Props {
  cancel: () => void;
  close: (params: object) => void;
  colonyAddress: Address;
}

const CreatePaymentDialog = ({ colonyAddress, cancel, close }: Props) => {
  const validationSchema = yup.object().shape({
    fromDomain: yup.number().required(),
    toAssignee: yup.number().required(),
    amount: yup.string().required(),
    tokenAddress: yup.string().required(),
    reason: yup.string().max(90),
  });

  const { data: colonyData } = useColonyQuery({
    variables: { address: colonyAddress },
  });

  const { data: subscribedUsersData } = useQuery(
    ColonySubscribedUsersDocument,
    { variables: { colonyAddress } },
  );

  const tokens = (colonyData && colonyData.colony.tokens) || [];
  const nativeTokenAddress = colonyData && colonyData.colony.nativeTokenAddress;

  const transform = useCallback(
    pipe(
      mapPayload((payload) => {
        // Find the selected token's decimals
        const selectedToken = tokens.find(
          (token) => token.address === payload.tokenAddress,
        );
        const decimals = getTokenDecimalsWithFallback(
          selectedToken && selectedToken.decimals,
        );

        // Convert amount string with decimals to BigInt (eth to wei)
        const amount = bigNumberify(moveDecimal(payload.amount, decimals));

        return {
          ...payload,
          colonyAddress,
          amount,
          fromDomain: parseInt(payload.fromDomain, 10),
          toAssignee: parseInt(payload.toAssignee, 10),
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
        toAssignee: undefined,
        amount: '',
        tokenAddress: nativeTokenAddress,
        reason: '',
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.MOVE_FUNDS_BETWEEN_POTS}
      error={ActionTypes.MOVE_FUNDS_BETWEEN_POTS_ERROR}
      // Close dialog immediately to give way for GasStation
      success={ActionTypes.MOVE_FUNDS_BETWEEN_POTS}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (!colonyData) return <SpinnerLoader />;
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colonyData.colony}
              cancel={cancel}
              subscribedUsers={subscribedUsersData.colony.subscribedUsers}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

CreatePaymentDialog.displayName = 'dashboard.CreatePaymentDialog';

export default CreatePaymentDialog;
