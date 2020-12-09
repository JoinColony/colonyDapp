import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useQuery } from '@apollo/client';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { ColonySubscribedUsersDocument, Colony } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './CreatePaymentDialogForm';

const MSG = defineMessages({
  noAmount: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.noAmount',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
});

export interface FormValues {
  domainId: string;
  recipient: Address;
  amount: string;
  tokenAddress: Address;
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.CreatePaymentDialog';

const CreatePaymentDialog = ({
  colony: { tokens = [], colonyAddress, nativeTokenAddress, colonyName },
  colony,
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    domainId: yup.number().required(),
    recipient: yup
      .object()
      .shape({
        profile: yup.object().shape({
          walletAddress: yup.string().required(),
        }),
      })
      .nullable()
      .default(null),
    amount: yup
      .string()
      .required()
      .min(0.01, () => MSG.noAmount),
    tokenAddress: yup.string().required(),
    annotation: yup.string().max(4000),
  });

  const { data: subscribedUsersData } = useQuery(
    ColonySubscribedUsersDocument,
    { variables: { colonyAddress } },
  );

  const transform = useCallback(
    pipe(
      mapPayload((payload) => {
        const {
          amount,
          tokenAddress,
          domainId,
          recipient: {
            profile: { walletAddress },
          },
        } = payload;

        // Find the selected token's decimals
        const selectedToken = tokens.find(
          (token) => token.address === tokenAddress,
        );
        const decimals = getTokenDecimalsWithFallback(
          selectedToken && selectedToken.decimals,
        );

        return {
          colonyName,
          colonyAddress,
          recipientAddress: walletAddress,
          domainId,
          singlePayment: {
            tokenAddress,
            amount,
            decimals,
          },
        };
      }),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        domainId: ROOT_DOMAIN_ID.toString(),
        recipient: undefined,
        amount: undefined,
        tokenAddress: nativeTokenAddress,
        annotation: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT}
      error={ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR}
      success={ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS}
      transform={transform}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => {
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              back={() => callStep(prevStep)}
              subscribedUsers={subscribedUsersData.colony.subscribedUsers}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

CreatePaymentDialog.displayName = displayName;

export default CreatePaymentDialog;
