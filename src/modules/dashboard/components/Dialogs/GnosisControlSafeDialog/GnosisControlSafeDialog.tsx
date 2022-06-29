import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { toFinite } from 'lodash';
import { defineMessages } from 'react-intl';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import GnosisControlSafeForm from './GnosisControlSafeForm';

const MSG = defineMessages({
  amountZero: {
    id: 'dashboard.GnosisControlSafeDialog.amountZero',
    defaultMessage: 'Amount must be greater than zero',
  },
});

/* to remove when data is wired in */
const safes = [
  {
    name: 'All Saints',
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c2',
    chain: 'Gnosis Chain',
  },
  {
    name: '',
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
    chain: 'Mainnet',
  },
];

export interface FormValues {
  safe: string;
  transactionType: string;
  tokenAddress?: string;
  amount?: string;
  forceAction: boolean;
}

export const transactionOptions = [
  {
    value: 'transferFunds',
    label: 'Transfer funds',
  },
  {
    value: 'transferNft',
    label: 'Transfer NFT',
  },
  {
    value: 'contractInteraction',
    label: 'Contract interaction',
  },
  {
    value: 'rawTransaction',
    label: 'Raw transaction',
  },
];

const displayName = 'dashboard.GnosisControlSafeDialog';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = yup.object().shape({
  safe: yup.string().required(),
  transactionType: yup.string().required(),
  recipient: yup.object().shape({
    profile: yup.object().shape({
      walletAddress: yup.string().when('transactionType', {
        is: (transactionType) => transactionType === 'transferFunds',
        then: yup.string().address().required(),
        otherwise: false,
      }),
    }),
  }),
  amount: yup.number().when('transactionType', {
    is: (transactionType) =>
      transactionType === 'transferFunds' ||
      transactionType === 'rawTransaction',
    then: yup
      .number()
      .transform((value) => toFinite(value))
      .required()
      .moreThan(0, () => MSG.amountZero),
    otherwise: false,
  }),
  tokenAddress: yup.string().when('transactionType', {
    is: (transactionType) => transactionType === 'transferFunds',
    then: yup.string().address().required(),
    otherwise: false,
  }),
  data: yup.string().when('transactionType', {
    is: (transactionType) => transactionType === 'rawTransaction',
    then: yup.string().required(),
    otherwise: false,
  }),
});

const GnosisControlSafeDialog = ({
  colony,
  cancel,
  callStep,
  prevStep,
  isVotingExtensionEnabled,
}: Props) => {
  return (
    <ActionForm
      initialValues={{
        safe: null,
        transactionType: null,
        forceAction: false,
        tokenAddress: colony.nativeTokenAddress,
        amount: null,
        recipient: null,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      success={ActionTypes.COLONY_ACTION_GENERIC_SUCCESS}
      error={ActionTypes.COLONY_ACTION_GENERIC_ERROR}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <GnosisControlSafeForm
            {...formValues}
            back={callStep && prevStep ? () => callStep(prevStep) : undefined}
            colony={colony}
            safes={safes}
            isVotingExtensionEnabled={isVotingExtensionEnabled}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

GnosisControlSafeDialog.displayName = displayName;

export default GnosisControlSafeDialog;
