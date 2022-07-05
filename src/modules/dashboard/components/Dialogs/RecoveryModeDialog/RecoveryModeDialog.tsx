import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony, useLoggedInUser } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

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
  colony: { colonyName, colonyAddress },
  colony,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const history = useHistory();

  const validationSchema = yup.object().shape({
    annotation: yup.string().max(4000),
  });

  const transform = useCallback(
    pipe(
      mapPayload(({ annotation: annotationMessage }) => {
        return {
          colonyName,
          colonyAddress,
          walletAddress,
          annotationMessage,
        };
      }),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        annotation: undefined,
      }}
      submit={ActionTypes.ACTION_RECOVERY}
      error={ActionTypes.ACTION_RECOVERY_ERROR}
      success={ActionTypes.ACTION_RECOVERY_SUCCESS}
      validationSchema={validationSchema}
      onSuccess={close}
      transform={transform}
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
