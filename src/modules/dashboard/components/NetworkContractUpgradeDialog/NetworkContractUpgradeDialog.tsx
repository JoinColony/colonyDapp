import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import { pipe, mergePayload, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './NetworkContractUpgradeDialogForm';

export interface FormValues {
  annotation: string;
}

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.NetworkContractUpgradeDialog';

const validationSchema = yup.object().shape({
  annotation: yup.string().max(4000),
});

const NetworkContractUpgradeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  colony: { colonyAddress, version, colonyName },
}: Props) => {
  const history = useHistory();

  const transform = useCallback(
    pipe(
      mapPayload(({ annotation: annotationMessage }) => {
        return {
          operationName: RootMotionOperationNames.UPGRADE,
          colonyAddress,
          colonyName,
          version,
          motionParams: [version],
          annotationMessage,
        };
      }),
      mergePayload({ colonyAddress, version, colonyName }),
      withMeta({ history }),
    ),
    [colonyAddress, version, colonyName],
  );

  return (
    <ActionForm
      initialValues={{
        annotation: undefined,
      }}
      submit={ActionTypes.COLONY_ACTION_VERSION_UPGRADE}
      error={ActionTypes.COLONY_ACTION_VERSION_UPGRADE_ERROR}
      success={ActionTypes.COLONY_ACTION_VERSION_UPGRADE_SUCCESS}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
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

NetworkContractUpgradeDialog.displayName = displayName;

export default NetworkContractUpgradeDialog;
