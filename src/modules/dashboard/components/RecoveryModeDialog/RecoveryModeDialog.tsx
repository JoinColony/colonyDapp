import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './RecoveryModeDialogForm';

export interface FormValues {
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.RecoveryModeDialog';

const RecoveryModeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
}: Props) => {
  const validationSchema = yup.object().shape({
    annotation: yup.string().max(4000),
  });

  return (
    <ActionForm
      initialValues={{
        annotation: undefined,
      }}
      submit={ActionTypes.COLONY_RECOVERY_MODE_ENTER}
      error={ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR}
      success={ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            colony={colony}
            back={() => callStep(prevStep)}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

RecoveryModeDialog.displayName = displayName;

export default RecoveryModeDialog;
