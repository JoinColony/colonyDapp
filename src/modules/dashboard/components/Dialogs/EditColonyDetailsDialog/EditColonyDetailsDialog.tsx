import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { useColonyFromNameQuery } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm from './EditColonyDetailsDialogForm';

export interface FormValues {
  forceAction: boolean;
  colonyDisplayName: string;
  colonyAvatarImage: string;
  annotationMessage: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

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
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: colonyAddress },
  });

  const { isVotingExtensionEnabled } = useEnabledExtensions({
    colonyAddress,
  });

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`MOTION_EDIT_COLONY${actionEnd}`]
        : ActionTypes[`ACTION_EDIT_COLONY${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

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
          verifiedAddresses: colonyData?.processedColony?.whitelistedAddresses,
          annotationMessage,
          isWhitelistActivated:
            colonyData?.processedColony?.isWhitelistActivated,
        }),
      ),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        colonyDisplayName: colonyDisplayName || colonyName,
        colonyAvatarImage: undefined,
        annotationMessage: undefined,
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
      onSuccess={close}
      transform={transform}
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
              back={() => callStep(prevStep)}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

EditColonyDetailsDialog.displayName = displayName;

export default EditColonyDetailsDialog;
