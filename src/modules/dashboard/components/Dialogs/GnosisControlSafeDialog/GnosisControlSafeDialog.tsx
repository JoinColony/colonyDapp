import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import GnosisControlSafeForm from './GnosisControlSafeForm';

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
});

const GnosisControlSafeDialog = ({
  colony,
  cancel,
  callStep,
  prevStep,
}: Props) => {
  return (
    <ActionForm
      initialValues={{
        safe: undefined,
        transactionType: transactionOptions[0],
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
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

GnosisControlSafeDialog.displayName = displayName;

export default GnosisControlSafeDialog;
