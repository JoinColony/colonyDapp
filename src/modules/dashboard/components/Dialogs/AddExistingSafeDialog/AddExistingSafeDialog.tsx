import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm, SelectOption } from '~core/Fields';
import { GNOSIS_AMB_BRIDGES, SAFE_NAMES_MAP } from '~modules/constants';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';

import DialogForm from './AddExistingSafeDialogForm';
import { getValidationSchema } from './validation';

export interface FormValues {
  chainId: string;
  contractAddress: Address;
  moduleContractAddress?: Address;
  safeName?: string;
  annotation?: string;
}

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

const displayName = 'dashboard.AddExistingSafeDialog';

const AddExistingSafeDialog = ({
  colony: { colonyAddress, colonyName, safes },
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const history = useHistory();
  const loadingSafeState = useState<boolean>(false);
  const loadingModuleState = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(1);
  const abortControllerState = useState<AbortController | undefined>(undefined);

  const validationSchema = getValidationSchema(
    stepIndex,
    abortControllerState,
    safes,
    loadingSafeState,
    loadingModuleState,
  );

  // Create array for Network options
  const networkOptions: SelectOption[] = Object.keys(GNOSIS_AMB_BRIDGES).map(
    (chainId) => {
      return {
        label: SAFE_NAMES_MAP[chainId],
        value: chainId,
      };
    },
  );

  const transform = useCallback(
    pipe(
      mapPayload(
        ({
          chainId,
          contractAddress,
          safeName,
          annotation: annotationMessage,
          moduleContractAddress,
        }) => {
          return {
            colonyName,
            colonyAddress,
            safeList: [
              {
                chainId,
                safeName,
                contractAddress,
                moduleContractAddress,
              },
            ],
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
        contractAddress: '',
        moduleContractAddress: undefined,
      }}
      validationSchema={validationSchema}
      submit={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
      error={ActionTypes.ACTION_MANAGE_EXISTING_SAFES_ERROR}
      success={ActionTypes.ACTION_MANAGE_EXISTING_SAFES_SUCCESS}
      transform={transform}
      onSuccess={close}
    >
      {(formProps: FormikProps<FormValues>) => {
        return (
          <Dialog cancel={cancel}>
            <DialogForm
              {...formProps}
              networkOptions={networkOptions}
              colonySafes={safes}
              back={() => callStep(prevStep)}
              colonyAddress={colonyAddress}
              loadingState={[loadingSafeState, loadingModuleState]}
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
            />
          </Dialog>
        );
      }}
    </ActionForm>
  );
};

AddExistingSafeDialog.displayName = displayName;

export default AddExistingSafeDialog;
