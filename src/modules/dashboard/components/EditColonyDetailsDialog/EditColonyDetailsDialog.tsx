import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './EditColonyDetailsDialogForm';

export interface FormValues {
  name: string;
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.EditColonyDetailsDialog';

const EditColonyDetailsDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
}: Props) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    annotation: yup.string().max(4000),
  });

  return (
    <ActionForm
      initialValues={{
        name: undefined,
        annotation: undefined,
      }}
      submit={ActionTypes.COLONY_EDIT_DETAILS}
      error={ActionTypes.COLONY_EDIT_DETAILS_ERROR}
      success={ActionTypes.COLONY_EDIT_DETAILS_SUCCESS}
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

EditColonyDetailsDialog.displayName = displayName;

export default EditColonyDetailsDialog;
