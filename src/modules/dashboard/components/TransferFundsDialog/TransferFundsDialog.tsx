import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import { bigNumberify } from 'ethers/utils';
import { useHistory } from 'react-router-dom';

import { pipe, mapPayload, withMeta } from '~utils/actions';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import Dialog from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import { useColonyQuery } from '~data/index';

import DialogForm from './TransferFundsDialogForm';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

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

const TransferFundsDialog = ({
  colonyAddress,
  toDomain,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    fromDomain: yup.number().required(),
    toDomain: yup.number().required(),
    amount: yup.string().required(),
    tokenAddress: yup.string().required(),
  });

  const { data: colonyData } = useColonyQuery({
    variables: { address: colonyAddress },
  });

  const tokens = (colonyData && colonyData.colony.tokens) || [];
  const nativeTokenAddress = colonyData && colonyData.colony.nativeTokenAddress;

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          tokenAddress,
          amount: transferAmount,
          fromDomain,
          toDomain: recipientDomain,
        }) => {
          // Find the selected token's decimals
          const selectedToken = tokens.find(
            (token) => token.address === tokenAddress,
          );
          const decimals = getTokenDecimalsWithFallback(
            selectedToken && selectedToken.decimals,
          );

          // Convert amount string with decimals to BigInt (eth to wei)
          const amount = bigNumberify(moveDecimal(transferAmount, decimals));

          return {
            colonyAddress,
            colonyName: colonyData?.colony?.colonyName,
            fromDomainId: parseInt(fromDomain, 10),
            toDomainId: parseInt(recipientDomain, 10),
            amount,
            tokenAddress,
          };
        },
      ),
      withMeta({ history }),
    ),
    [],
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
      submit={ActionTypes.COLONY_ACTION_MOVE_FUNDS}
      error={ActionTypes.COLONY_ACTION_MOVE_FUNDS_ERROR}
      success={ActionTypes.COLONY_ACTION_MOVE_FUNDS_SUCCESS}
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
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

TransferFundsDialog.displayName = 'dashboard.TransferFundsDialog';

export default TransferFundsDialog;
