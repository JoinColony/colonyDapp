import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm from './EditDomainDialogForm';
import { Color } from '~core/ColorTag';

export interface FormValues {
  forceAction: boolean;
  domainId: string;
  domainName: string;
  domainColor?: Color;
  domainPurpose?: string;
  annotationMessage?: string;
}

interface CustomWizardDialogProps extends ActionDialogProps {
  selectedDomainId?: string;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'dashboard.EditDomainDialog';

const EditDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  colony: { colonyAddress, colonyName, domains },
  selectedDomainId,
  isVotingExtensionEnabled,
}: Props) => {
  const [isForce, setIsForce] = useState(false);
  const history = useHistory();

  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;

      return isVotingExtensionEnabled && !isForce
        ? ActionTypes[`COLONY_MOTION_DOMAIN_CREATE_EDIT${actionEnd}`]
        : ActionTypes[`COLONY_ACTION_DOMAIN_EDIT${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const validationSchema = yup.object().shape({
    domainName: yup.string().max(20).required(),
    domainId: yup.number().required(),
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
        isCreateDomain: false,
      })),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        forceAction: false,
        domainName: domains.find(({ ethDomainId }) =>
          selectedDomainId
            ? ethDomainId.toString() === selectedDomainId
            : ethDomainId !== ROOT_DOMAIN_ID,
        )?.name,
        domainColor: undefined,
        domainPurpose: undefined,
        annotationMessage: undefined,
        domainId:
          selectedDomainId ||
          domains
            .find(({ ethDomainId }) => ethDomainId !== ROOT_DOMAIN_ID)
            ?.ethDomainId.toString(),
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
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              isVotingExtensionEnabled={isVotingExtensionEnabled}
              colony={colony}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
