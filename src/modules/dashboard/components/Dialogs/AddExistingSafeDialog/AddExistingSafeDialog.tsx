import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm } from '~core/Fields';

import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './AddExistingSafeDialogForm';

export interface FormValues {
  chainId: string;
  contractAddress: Address;
  safeName: string;
  annotation: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    ethDomainId?: number;
  };

const displayName = 'dashboard.AddExistingSafeDialog';

const AddExistingSafeDialog = ({
  colony: { colonyAddress, colonyName },
  colony,
  isVotingExtensionEnabled,
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  // @TODO change this accordingly
  const getFormAction = useCallback(
    (actionType: 'SUBMIT' | 'ERROR' | 'SUCCESS') => {
      const actionEnd = actionType === 'SUBMIT' ? '' : `_${actionType}`;
      return ActionTypes[`COLONY_ACTION_EXPENDITURE_PAYMENT${actionEnd}`];
    },
    [],
  );

  const validationSchema = yup.object().shape({
    chainId: yup.string().required(),
    contractAddress: yup.string().address().required(),
    safeName: yup.string().required().max(20),
    annotation: yup.string().max(90),
  });

  // @TODO change this accordingly
  const transform = useCallback(
    pipe(
      mapPayload((payload) => {
        const {
          contractAddress,
          annotation: annotationMessage,
          chainId,
          safeName,
        } = payload;

        return {
          colonyName,
          colonyAddress,
          chainId,
          safeName,
          contractAddress,
          annotationMessage,
        };
      }),
      withMeta({ history }),
    ),
    [],
  );

  return (
    <ActionForm
      initialValues={{
        chainId: 'xdai',
        annotation: undefined,
        safeName: undefined,
        contractAddress: undefined,
      }}
      validationSchema={validationSchema}
      submit={getFormAction('SUBMIT')}
      error={getFormAction('ERROR')}
      success={getFormAction('SUCCESS')}
      transform={transform}
      onSuccess={close}
    >
      {(formValues: FormikProps<FormValues>) => {
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formValues}
              colony={colony}
              isVotingExtensionEnabled={isVotingExtensionEnabled}
              back={() => callStep(prevStep)}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

AddExistingSafeDialog.displayName = displayName;

export default AddExistingSafeDialog;
