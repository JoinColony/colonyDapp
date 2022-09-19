import React, { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { isAddress } from 'web3-utils';

import Dialog, { DialogProps, ActionDialogProps } from '~core/Dialog';
import { ActionForm, SelectOption } from '~core/Fields';
import {
  FETCH_ABORTED,
  GNOSIS_AMB_BRIDGES,
  SAFE_NAMES_MAP,
} from '~modules/constants';
import { Address } from '~types/index';
import { ActionTypes } from '~redux/index';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { WizardDialogType } from '~utils/hooks';
import { getTxServiceBaseUrl } from '~modules/dashboard/sagas/utils/safeHelpers';

import DialogForm from './AddExistingSafeDialogForm';

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

export const MSG = defineMessages({
  contractAddressError: {
    id: 'dashboard.AddExistingSafeDialog.contractAddressError',
    defaultMessage: 'Please enter a contract address',
  },
  safeNameError: {
    id: 'dashboard.AddExistingSafeDialog.safeNameError',
    defaultMessage: 'Please enter a safe name',
  },
  moduleAddressError: {
    id: 'dashboard.AddExistingSafeDialog.moduleAddressError',
    defaultMessage: 'Please enter a module address',
  },
  safeAlreadyExistsError: {
    id: 'dashboard.AddExistingSafeDialog.safeAlreadyExistsError',
    defaultMessage: 'Safe already exists in this colony.',
  },
  fetchFailedError: {
    id: 'dashboard.AddExistingSafeDialog.fetchFailedError',
    defaultMessage: `Could not fetch {type} details. Please check your connection and try again.`,
  },
  safeNotFoundError: {
    id: 'dashboard.AddExistingSafeDialog.safeNotFoundError',
    defaultMessage: `Safe not found on {selectedChain}`,
  },
  moduleNotConnectedError: {
    id: 'dashboard.AddExistingSafeDialog.moduleNotConnectedError',
    defaultMessage: `Module not connected to safe on {selectedChain}`,
  },
  moduleNotFoundError: {
    id: 'dashboard.AddExistingSafeDialog.moduleNotFoundError',
    defaultMessage: `Module not found on {selectedChain}`,
  },
});
const displayName = 'dashboard.AddExistingSafeDialog';

// "this" is needed within yup.test().
/* eslint-disable react/no-this-in-sfc */
const AddExistingSafeDialog = ({
  colony: { colonyAddress, colonyName, safes },
  callStep,
  prevStep,
  cancel,
  close,
}: Props) => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const loadingSafeState = useState<boolean>(false);
  const loadingModuleState = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [abortController, setAbortController] = useState<
    AbortController | undefined
  >(undefined);

  function getFetchErrorMsg(
    e: Error,
    type: 'Safe' | 'Module',
  ): yup.ValidationError {
    // If fetch was aborted
    if (e instanceof DOMException && e.message.includes('abort')) {
      return this.createError({
        message: FETCH_ABORTED,
      });
    }

    // If fetching produces an error (e.g. network error)
    return this.createError({
      message: formatMessage(MSG.fetchFailedError, { type }),
    });
  }
  const handleTestCompletion = (
    result: true | yup.ValidationError,
    type: 'Safe' | 'Module',
  ): Promise<true | yup.ValidationError> => {
    const isFetchAborted = result !== true && result.message === FETCH_ABORTED;
    const loadingState =
      type === 'Safe' ? loadingSafeState : loadingModuleState;
    const [, setIsLoadingState] = loadingState;

    if (!isFetchAborted) {
      setIsLoadingState(false);
      return new Promise((res) => res(result));
    }
    // If fetching was aborted, don't show error.
    return new Promise((res) => res(true));
  };
  const validationSchema = yup.object().shape({
    chainId: yup.string().required(),
    contractAddress: yup
      .string()
      .address()
      .required(() => MSG.contractAddressError)
      .test(
        'is-address-valid',
        'Invalid Address Error',
        async function contractAddressTest(contractAddress) {
          /*
           * Return if address is invalid. This ensures yup doesn't wait for fetching to complete before
           * returning the "address" or "required" error messages.
           */
          if (!contractAddress || !isAddress(contractAddress)) {
            return false;
          }

          // Only run if we're on the "Check safe" page.
          if (stepIndex !== 1) {
            return true;
          }

          /*
           * Aborts outstanding previous fetch requests.
           * Avoids race conditions on slow connections and prevents
           * the incorrect error from being displayed.
           */
          const controller = new AbortController();
          setAbortController(controller);
          if (abortController) {
            abortController.abort();
          }

          const validateAddress = async () => {
            const isSafeAlreadyAdded = safes.find(
              (safe) =>
                safe?.chainId === this.parent.chainId &&
                safe?.contractAddress === contractAddress,
            );

            if (isSafeAlreadyAdded) {
              return this.createError({
                message: formatMessage(MSG.safeAlreadyExistsError),
              });
            }
            const selectedChain: string =
              SAFE_NAMES_MAP[Number(this.parent.chainId)];
            const baseURL = getTxServiceBaseUrl(selectedChain);
            const getSafeData = async (
              url: string,
            ): Promise<yup.ValidationError | true> => {
              try {
                // Check if safe exists
                const response = await fetch(url, {
                  signal: controller.signal,
                });
                // If safe exists on selected chain
                if (response.status === 200) {
                  return true;
                }
                // If fetching is successful but returns any status code other than 200
                return this.createError({
                  message: formatMessage(MSG.safeNotFoundError, {
                    selectedChain,
                  }),
                });
              } catch (e) {
                return getFetchErrorMsg.call(this, e, 'Safe');
              }
            };
            return getSafeData(`${baseURL}/v1/safes/${contractAddress}/`);
          };
          return validateAddress().then((result) => {
            return handleTestCompletion(result, 'Safe');
          });
        },
      ),
    safeName: yup
      .string()
      .required(() => MSG.safeNameError)
      .max(20),
    annotation: yup.string().max(4000),
    moduleContractAddress: yup
      .string()
      .address()
      .required(() => MSG.moduleAddressError)
      .test(
        'does-module-exist',
        'Invalid Module Error',
        async function moduleAddressTest(moduleAddress) {
          if (!moduleAddress || !isAddress(moduleAddress)) {
            return false;
          }

          // Don't run if we're on the "Check safe" page.
          if (stepIndex === 1) {
            return true;
          }

          const controller = new AbortController();
          setAbortController(controller);
          if (abortController) {
            abortController.abort();
          }

          const fetchModule = async (): Promise<yup.ValidationError | true> => {
            const selectedChain: string =
              SAFE_NAMES_MAP[Number(this.parent.chainId)];
            const baseURL = getTxServiceBaseUrl(selectedChain);
            try {
              const response = await fetch(
                `${baseURL}/v1/modules/${moduleAddress}/safes`,
                { signal: controller.signal },
              );
              if (response.status === 200) {
                const {
                  safes: connectedSafes,
                }: { safes: Address[] } = await response.json();
                if (connectedSafes.includes(this.parent.contractAddress)) {
                  return true;
                }
                return this.createError({
                  message: formatMessage(MSG.moduleNotConnectedError, {
                    selectedChain,
                  }),
                });
              }
              return this.createError({
                message: formatMessage(MSG.moduleNotFoundError, {
                  selectedChain,
                }),
              });
            } catch (e) {
              return getFetchErrorMsg.call(this, e, 'Module');
            }
          };

          return fetchModule().then((result) => {
            return handleTestCompletion(result, 'Module');
          });
        },
      ),
  });
  /* eslint-enable react/no-this-in-sfc */

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
