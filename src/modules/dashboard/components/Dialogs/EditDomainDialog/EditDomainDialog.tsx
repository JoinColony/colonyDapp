import React, { useCallback, useState, useMemo } from 'react';
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

import DialogForm from './EditDomainDialogForm';
import { Color } from '~core/ColorTag';

export interface FormValues {
  forceAction: boolean;
  domainId: string;
  domainName: string;
  domainColor?: Color;
  domainPurpose?: string;
  annotationMessage?: string;
  motionDomainId: string;
}

interface CustomWizardDialogProps extends ActionDialogProps {
  ethDomainId?: number;
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
  ethDomainId: preselectedDomainId,
}: Props) => {
  const selectedDomain = useMemo(
    () =>
      domains.find(({ ethDomainId }) =>
        preselectedDomainId === 0 ||
        preselectedDomainId === undefined ||
        preselectedDomainId === ROOT_DOMAIN_ID
          ? ethDomainId !== ROOT_DOMAIN_ID
          : ethDomainId === preselectedDomainId,
      ),
    [preselectedDomainId, domains],
  );

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
        : ActionTypes[`ACTION_DOMAIN_EDIT${actionEnd}`];
    },
    [isVotingExtensionEnabled, isForce],
  );

  const validationSchema = yup.object().shape({
    domainName: yup.string().max(20).required(),
    domainId: yup.number().required(),
    domainColor: yup.string(),
    domainPurpose: yup.string().nullable().max(90),
    annotationMessage: yup.string().max(4000),
    motionDomainId: yup.number(),
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
        domainName: selectedDomain?.name,
        domainColor: undefined,
        domainPurpose: undefined,
        annotationMessage: undefined,
        domainId: selectedDomain?.ethDomainId.toString(),
        motionDomainId: selectedDomain?.ethDomainId,
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
