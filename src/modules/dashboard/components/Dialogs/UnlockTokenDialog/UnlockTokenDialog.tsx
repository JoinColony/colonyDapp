import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import Dialog, { ActionDialogProps, DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { pipe, withMeta, withKey, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import UnlockTokenForm from './UnlockTokenForm';

export interface FormValues {
  forceAction: boolean;
  annotation: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

const displayName = 'dashboard.UnlockTokenDialog';

const validationSchema = yup.object().shape({
  forceAction: yup.bool(),
  annotation: yup.string().max(4000),
});

const UnlockTokenDialog = ({
  colony: { colonyAddress, colonyName },
  colony,
  cancel,
  close,
  callStep,
  prevStep,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`ROOT_MOTION${actionEnd}`]
        : ActionTypes[`ACTION_UNLOCK_TOKEN${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const transform = useCallback(
    pipe(
      withKey(colonyAddress),
      mapPayload(({ annotationMessage }) => ({
        annotationMessage,
        colonyAddress,
        operationName: RootMotionOperationNames.UNLOCK_TOKEN,
        motionParams: [],
        colonyName,
      })),
      withMeta({ history }),
    ),
    [colonyAddress],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        annotationMessage: undefined,
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      validationSchema={validationSchema}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }

        return (
          <Dialog cancel={cancel}>
            <UnlockTokenForm
              {...formValues}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

UnlockTokenDialog.displayName = displayName;

export default UnlockTokenDialog;
