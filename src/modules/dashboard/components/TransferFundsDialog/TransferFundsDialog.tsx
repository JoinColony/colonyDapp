import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';
import { bigNumberify } from 'ethers/utils';
import { useHistory } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { pipe, mapPayload, withMeta } from '~utils/actions';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { Colony } from '~data/index';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './TransferFundsDialogForm';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.TransferFundsDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'dashboard.CreatePaymentDialog.TransferFundsDialog.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

export interface FormValues {
  fromDomain?: string;
  toDomain?: string;
  amount: string;
  tokenAddress?: Address;
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
  fromDomain?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.TransferFundsDialog';

const TransferFundsDialog = ({
  colony: { tokens = [], colonyAddress, nativeTokenAddress, colonyName },
  colony,
  fromDomain,
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    fromDomain: yup.number().required(),
    toDomain: yup.number().required(),
    amount: yup
      .number()
      .required()
      .moreThan(0, () => MSG.amountZero),
    tokenAddress: yup.string().address().required(),
    annotation: yup.string().max(4000),
  });

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          tokenAddress,
          amount: transferAmount,
          fromDomain: sourceDomain,
          toDomain,
          annotation: annotationMessage,
        }) => {
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
            colonyName,
            fromDomainId: parseInt(sourceDomain, 10),
            toDomainId: parseInt(toDomain, 10),
            amount,
            tokenAddress,
            annotationMessage,
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
        fromDomain: fromDomain ? String(fromDomain) : ROOT_DOMAIN_ID.toString(),
        toDomain: undefined,
        amount: '',
        tokenAddress: nativeTokenAddress,
        annotation: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_MOVE_FUNDS}
      error={ActionTypes.COLONY_ACTION_MOVE_FUNDS_ERROR}
      success={ActionTypes.COLONY_ACTION_MOVE_FUNDS_SUCCESS}
      onSuccess={close}
      transform={transform}
      validateOnChange
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            colony={colony}
            back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

TransferFundsDialog.displayName = displayName;

export default TransferFundsDialog;
