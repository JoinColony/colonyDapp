import React from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './ManageDomainsDialogForm';

export interface FormValues {
  domainName: string;
  domainPurpose: string;
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep: string;
  colony: Colony;
  id?: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.ManageDomainsDialog';

const ManageDomainsDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  id,
}: Props) => {
  const validationSchema = yup.object().shape({
    domainName: yup.string().required(),
    domainPurpose: yup.string().required().max(90),
    annotation: yup.string().max(4000),
  });

  return (
    <ActionForm
      initialValues={{
        domainName: undefined,
        domainPurpose: undefined,
        annotation: undefined,
      }}
      submit={ActionTypes.DOMAIN_CREATE}
      error={ActionTypes.DOMAIN_CREATE_ERROR}
      success={ActionTypes.DOMAIN_CREATE_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            back={() => callStep(prevStep)}
            colony={colony}
            id={id}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

ManageDomainsDialog.displayName = displayName;

export default ManageDomainsDialog;
