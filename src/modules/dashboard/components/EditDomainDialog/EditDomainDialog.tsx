import React, { useCallback, useState, useEffect } from 'react';
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
  id?: string;
  selectedDomainId?: string;
}

type Props = DialogProps & WizardDialogType<object> & CustomWizardDialogProps;

const displayName = 'dashboard.EditDomainDialog';

const EditDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  colony: { colonyAddress, colonyName },
  id,
  selectedDomainId = ROOT_DOMAIN_ID.toString(),
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    domainName: yup.string(),
    domainId: yup.number().required(),
    domainColor: yup.string(),
    domainPurpose: yup.string(),
    annotationMessage: yup.string().max(4000),
  });

  const transform = useCallback(
    pipe(
      mapPayload((payload) => ({
        colonyAddress,
        colonyName,
        ...payload,
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
        domainId: selectedDomainId,
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
            back={prevStep ? () => callStep(prevStep) : undefined}
            colony={colony}
            id={id}
          />
        </Dialog>
      )}
    </ActionForm>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
