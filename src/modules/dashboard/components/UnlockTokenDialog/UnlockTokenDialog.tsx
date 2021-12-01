import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import {
  pipe,
  mergePayload,
  withMeta,
  withKey,
  mapPayload,
} from '~utils/actions';
import { Colony } from '~data/index';
import { WizardDialogType } from '~utils/hooks';

import UnlockTokenForm from './UnlockTokenForm';

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.UnlockTokenDialog';

const UnlockTokenDialog = ({
  colony: { colonyAddress },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const history = useHistory();

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(({ annotationMessage }) => ({
        annotationMessage,
      })),
      mergePayload({
        colonyAddress,
      }),
      withMeta({ history }),
    ),
    [colonyAddress],
  );

  return (
    <ActionForm
      initialValues={{
        annotationMessage: undefined,
      }}
      submit={ActionTypes.COLONY_ACTION_UNLOCK_TOKEN}
      error={ActionTypes.COLONY_ACTION_UNLOCK_TOKEN_ERROR}
      success={ActionTypes.COLONY_ACTION_UNLOCK_TOKEN_SUCCESS}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<any>) => (
        <Dialog cancel={cancel}>
          <UnlockTokenForm
            {...formValues}
            colony={colony}
            back={prevStep && callStep ? () => callStep(prevStep) : undefined}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

UnlockTokenDialog.displayName = displayName;

export default UnlockTokenDialog;
