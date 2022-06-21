import React from 'react';
import { FormikProps } from 'formik';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import GnosisControlSafeForm from './GnosisControlSafeForm';

const displayName = 'dashboard.GnosisControlSafeDialog';

const safes = [
  {
    name: 'All Saints',
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c2',
    chain: 'Gnosis Chain',
  },
  {
    name: '(Mainnet)',
    address: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
    chain: 'Mainnet',
  },
];

export interface FormValues {
  safeType: any;
  transactionType: any;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const GnosisControlSafeDialog = ({
  colony,
  cancel,
  callStep,
  prevStep,
}: Props) => {
  return (
    <ActionForm
      initialValues={{}}
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
