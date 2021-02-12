import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm from './EditColonyDetailsDialogForm';

export interface FormValues {
  colonyDisplayName: string;
  colonyAvatarImage: string;
  annotationMessage: string;
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
  colony: {
    colonyAddress,
    colonyName,
    displayName: colonyDisplayName,
    avatarURL,
    avatarHash,
    tokenAddresses,
    nativeTokenAddress,
  },
  colony,
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    colonyAvatarImage: yup.string().nullable(),
    colonyDisplayName: yup.string().required(),
    annotationMessage: yup.string().max(4000),
  });

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          colonyAvatarImage,
          colonyDisplayName: payloadDisplayName,
          annotationMessage,
        }) => ({
          colonyAddress,
          colonyName,
          colonyDisplayName: payloadDisplayName,
          colonyAvatarImage:
            typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
              ? colonyAvatarImage
              : avatarURL,
          colonyAvatarHash: avatarHash,
          hasAvatarChanged: !!(
            typeof colonyAvatarImage === 'string' || colonyAvatarImage === null
          ),
          colonyTokens: tokenAddresses.filter(
            (tokenAddres) => tokenAddres !== nativeTokenAddress,
          ),
          annotationMessage,
        }),
      ),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        colonyDisplayName: colonyDisplayName || colonyName,
        colonyAvatarImage: undefined,
        annotationMessage: undefined,
      }}
      submit={ActionTypes.COLONY_ACTION_EDIT_COLONY}
      error={ActionTypes.COLONY_ACTION_EDIT_COLONY_ERROR}
      success={ActionTypes.COLONY_ACTION_EDIT_COLONY_SUCCESS}
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

EditColonyDetailsDialog.displayName = displayName;

export default EditColonyDetailsDialog;
