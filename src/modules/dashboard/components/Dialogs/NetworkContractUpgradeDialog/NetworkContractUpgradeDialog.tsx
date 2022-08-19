import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import { pipe, mergePayload, withMeta, mapPayload } from '~utils/actions';
import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { RootMotionOperationNames } from '~redux/types/actions';
import { WizardDialogType } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import DialogForm from './NetworkContractUpgradeDialogForm';

export interface FormValues {
  forceAction: boolean;
  annotation: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  ActionDialogProps;

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
        : ActionTypes[`ACTION_VERSION_UPGRADE${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );
  const currentVersion = parseInt(version, 10);
  const nextVersion = currentVersion + 1;
  const transform = useCallback(
    pipe(
      mapPayload(({ annotation: annotationMessage }) => {
        return {
          operationName: RootMotionOperationNames.UPGRADE,
          colonyAddress,
          colonyName,
          version,
          motionParams: [nextVersion],
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
        forceAction: false,
        annotation: undefined,
        /*
         * @NOTE That since this a root motion, and we don't actually make use
         * of the motion domain selected (it's disabled), we don't need to actually
         * pass the value over to the motion, since it will always be 1
         */
      }}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => {
        if (formValues.values.forceAction !== isForce) {
          setIsForce(formValues.values.forceAction);
        }
        return (
          <Dialog cancel={cancel}>
            <DialogForm
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

NetworkContractUpgradeDialog.displayName = displayName;

export default NetworkContractUpgradeDialog;
