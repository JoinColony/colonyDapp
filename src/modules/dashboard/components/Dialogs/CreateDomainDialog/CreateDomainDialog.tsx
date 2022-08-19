import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm from './CreateDomainDialogForm';
import { Color } from '~core/ColorTag';

export interface FormValues {
  forceAction: boolean;
  teamName: string;
  domainColor?: Color;
  domainPurpose?: string;
  annotationMessage?: string;
}

type Props = DialogProps & WizardDialogType<object> & ActionDialogProps;

const displayName = 'dashboard.CreateDomainDialog';

const CreateDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  colony: { colonyAddress, colonyName },
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
        ? ActionTypes[`MOTION_DOMAIN_CREATE_EDIT${actionEnd}`]
        : ActionTypes[`ACTION_DOMAIN_CREATE${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const validationSchema = yup.object().shape({
    teamName: yup.string().max(20).required(),
    domainColor: yup.string(),
    domainPurpose: yup.string().max(90),
    annotationMessage: yup.string().max(4000),
  });

  const transform = useCallback(
    pipe(
      mapPayload((payload) => ({
        ...payload,
        colonyAddress,
        colonyName,
        domainName: payload.teamName,
        isCreateDomain: true,
      })),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        teamName: undefined,
        domainColor: Color.LightPink,
        domainPurpose: undefined,
        annotationMessage: undefined,
        motionDomainId: ROOT_DOMAIN_ID,
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
              back={prevStep ? () => callStep(prevStep) : undefined}
              colony={colony}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

CreateDomainDialog.displayName = displayName;

export default CreateDomainDialog;
