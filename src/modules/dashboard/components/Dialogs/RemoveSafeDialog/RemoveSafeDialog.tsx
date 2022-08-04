import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { useHistory } from 'react-router';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';
import { Address } from '~types/index';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm from './RemoveSafeDialogForm';

const displayName = 'dashboard.RemoveSafeDialog';

export interface FormValues {
  safeList: Address[];
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  Omit<ActionDialogProps, 'isVotingExtensionEnabled'>;

const RemoveSafeDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
}: Props) => {
  const history = useHistory();
  const { safes } = colony;

  const transform = useCallback(
    pipe(
      mapPayload(({ safeList, annotation: annotationMessage }) => {
        return {
          colonyName: colony.colonyName,
          colonyAddress: colony.colonyAddress,
          safeAddresses: safeList,
          annotationMessage,
          isRemovingSafes: true,
        };
      }),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        // if there's only 1 safe then that safe is already checked.
        safeList: safes.length === 1 ? [safes[0].contractAddress] : [],
      }}
      submit={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
      error={ActionTypes.ACTION_MANAGE_EXISTING_SAFES_ERROR}
      success={ActionTypes.ACTION_MANAGE_EXISTING_SAFES_SUCCESS}
      onSuccess={close}
      transform={transform}
    >
      {(formValues: FormikProps<FormValues>) => {
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              safeList={safes}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

RemoveSafeDialog.displayName = displayName;

export default RemoveSafeDialog;
