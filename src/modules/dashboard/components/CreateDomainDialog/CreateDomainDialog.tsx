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

import DialogForm from './CreateDomainDialogForm';
import { Color } from '~core/ColorTag';

export interface FormValues {
  teamName: string;
  domainColor?: Color;
  domainPurpose?: string;
  annotationMessage?: string;
}

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.CreateDomainDialog';

const CreateDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  colony: { colonyAddress, colonyName },
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    teamName: yup.string().max(20).required(),
    domainColor: yup.string(),
    domainPurpose: yup.string().max(90),
    annotationMessage: yup.string().max(4000),
  });

  const transform = useCallback(
    pipe(
      mapPayload((payload) => ({
        colonyAddress,
        colonyName,
        domainName: payload.teamName,
        ...payload,
      })),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        teamName: undefined,
        domainColor: Color.LightPink,
        domainPurpose: undefined,
        annotationMessage: undefined,
      }}
      submit={ActionTypes.COLONY_ACTION_DOMAIN_CREATE}
      error={ActionTypes.COLONY_ACTION_DOMAIN_CREATE_ERROR}
      success={ActionTypes.COLONY_ACTION_DOMAIN_CREATE_SUCCESS}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            back={prevStep ? () => callStep(prevStep) : undefined}
            colony={colony}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

CreateDomainDialog.displayName = displayName;

export default CreateDomainDialog;
