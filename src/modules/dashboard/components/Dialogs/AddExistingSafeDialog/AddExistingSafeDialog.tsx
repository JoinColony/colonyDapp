import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm, SelectOption } from '~core/Fields';
import { GNOSIS_SAFE_NETWORKS } from '~modules/constants';
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
  ActionDialogProps;

const displayName = 'dashboard.AddExistingSafeDialog';

const AddExistingSafeDialog = ({
  colony: { colonyAddress, colonyName },
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const history = useHistory();

  const validationSchema = yup.object().shape({
    chainId: yup.string().required(),
    contractAddress: yup.string().address().required(),
    safeName: yup.string().required().max(20),
    annotation: yup.string().max(4000),
  });

  // Create array for Network options
  const networkOptions: SelectOption[] = GNOSIS_SAFE_NETWORKS.map((option) => {
    return {
      label: option.name,
      value: option.chainId.toString(),
    };
  });

  // @TODO change this accordingly when wiring up
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
        chainId: networkOptions[0].value,
        annotation: undefined,
        safeName: undefined,
        contractAddress: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.COLONY_ACTION_GENERIC}
      error={ActionTypes.COLONY_ACTION_GENERIC}
      success={ActionTypes.COLONY_ACTION_GENERIC}
      transform={transform}
      onSuccess={close}
    >
      {(formProps: FormikProps<FormValues>) => {
        const { isSubmitting, isValid, handleSubmit } = formProps;
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...{
                isSubmitting,
                isValid,
                handleSubmit,
                networkOptions,
              }}
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
