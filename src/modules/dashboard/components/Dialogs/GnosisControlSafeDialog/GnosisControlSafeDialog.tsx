import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import toFinite from 'lodash/toFinite';
import { defineMessages } from 'react-intl';

import { AnyUser } from '~data/index';
import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { Address } from '~types/index';

import GnosisControlSafeForm, {
  TransactionTypes,
} from './GnosisControlSafeForm';

const MSG = defineMessages({
  requiredFieldError: {
    id: 'dashboard.GnosisControlSafeDialog.requiredFieldError',
    defaultMessage: 'Please enter a value',
  },
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
  transactions: {
    transactionType: string;
    tokenAddress?: string;
    amount?: number;
    recipient?: AnyUser;
    data?: string;
    contract?: string;
    abi?: string;
    contractFunction?: string;
    nft?: string;
  }[];
  safe: string;
  forceAction: boolean;
}

const displayName = 'dashboard.GnosisControlSafeDialog';

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const validationSchema = yup.object().shape({
  safe: yup.string().required(() => MSG.requiredFieldError),
  transactions: yup.array(
    yup.object().shape({
      transactionType: yup.string().required(() => MSG.requiredFieldError),
      recipient: yup.object().shape({
        profile: yup.object().shape({
          walletAddress: yup.string().when('transactionType', {
            is: (transactionType) => transactionType === 'transferFunds',
            then: yup
              .string()
              .address()
              .required(() => MSG.requiredFieldError),
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
          .required(() => MSG.requiredFieldError)
          .moreThan(0, () => MSG.amountZero),
        otherwise: false,
      }),
      tokenAddress: yup.string().when('transactionType', {
        is: (transactionType) => transactionType === 'transferFunds',
        then: yup
          .string()
          .address()
          .required(() => MSG.requiredFieldError),
        otherwise: false,
      }),
      data: yup.string().when('transactionType', {
        is: (transactionType) => transactionType === 'rawTransaction',
        then: yup.string().required(() => MSG.requiredFieldError),
        otherwise: false,
      }),
      contract: yup.string().when('transactionType', {
        is: (transactionType) => transactionType === 'contractInteraction',
        then: yup
          .string()
          .address()
          .required(() => MSG.requiredFieldError),
        otherwise: false,
      }),
      abi: yup.string().when('transactionType', {
        is: (transactionType) => transactionType === 'contractInteraction',
        then: yup.string().required(() => MSG.requiredFieldError),
        otherwise: false,
      }),
      contractFunction: yup.string().when('transactionType', {
        is: (transactionType) => transactionType === 'contractInteraction',
        then: yup.string().required(() => MSG.requiredFieldError),
        otherwise: false,
      }),
    }),
  ),
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
        safe: '',
        transactions: [
          {
            transactionType: '',
            tokenAddress: colony.nativeTokenAddress,
            amount: undefined,
            recipient: null,
            data: '',
            contract: '',
            abi: '',
            contractFunction: '',
          },
        ],
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
