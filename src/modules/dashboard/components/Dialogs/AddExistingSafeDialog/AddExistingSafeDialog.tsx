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

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          chainId,
          contractAddress,
          safeName,
          annotation: annotationMessage,
        }) => {
          return {
            colonyName,
            colonyAddress,
            chainId,
            safeName,
            contractAddress,
            annotationMessage,
          };
        },
      ),
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
      submit={ActionTypes.ACTION_ADD_EXISTING_SAFE}
      error={ActionTypes.ACTION_ADD_EXISTING_SAFE_ERROR}
      success={ActionTypes.ACTION_ADD_EXISTING_SAFE_SUCCESS}
      transform={transform}
      onSuccess={close}
    >
      {(formProps: FormikProps<FormValues>) => {
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              formProps={formProps}
              networkOptions={networkOptions}
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
