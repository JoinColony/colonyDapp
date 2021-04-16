import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Dialog, { DialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Colony } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~utils/hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';

import DialogForm from './EditDomainDialogForm';
import { Color } from '~core/ColorTag';

export interface FormValues {
  domainId: string;
  domainName: string;
  domainColor?: Color;
  domainPurpose?: string;
  annotationMessage?: string;
}

interface CustomWizardDialogProps {
  prevStep?: string;
  colony: Colony;
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
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    domainName: yup.string().max(20),
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
        domainName: undefined,
        domainColor: undefined,
        domainPurpose: undefined,
        annotationMessage: undefined,
        domainId:
          selectedDomainId ||
          domains
            .find(({ ethDomainId }) => ethDomainId !== ROOT_DOMAIN_ID)
            ?.ethDomainId.toString(),
      }}
      submit={ActionTypes.COLONY_ACTION_DOMAIN_EDIT}
      error={ActionTypes.COLONY_ACTION_DOMAIN_EDIT_ERROR}
      success={ActionTypes.COLONY_ACTION_DOMAIN_EDIT_SUCCESS}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => (
        <Dialog cancel={cancel}>
          <DialogForm
            {...formValues}
            back={prevStep && callStep ? () => callStep(prevStep) : undefined}
            colony={colony}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
