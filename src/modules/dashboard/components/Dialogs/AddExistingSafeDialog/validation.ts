import { defineMessages } from 'react-intl';
import { isAddress } from 'web3-utils';
import * as yup from 'yup';

import { FETCH_ABORTED, SAFE_NAMES_MAP } from '~constants';
import { ColonySafe } from '~data/generated';
import { getTxServiceBaseUrl } from '~modules/dashboard/sagas/utils/safeHelpers';
import { Address } from '~types/index';
import { intl } from '~utils/intl';

const MSG = defineMessages({
  contractAddressError: {
    id: 'dashboard.AddExistingSafeDialog.validation.contractAddressError',
    defaultMessage: 'Please enter a contract address',
  },
  safeAlreadyExistsError: {
    id: 'dashboard.AddExistingSafeDialog.validation.safeAlreadyExistsError',
    defaultMessage: 'Safe already exists in this colony.',
  },
  safeNotFoundError: {
    id: 'dashboard.AddExistingSafeDialog.validation.safeNotFoundError',
    defaultMessage: `Safe not found on {selectedChain}`,
  },
  fetchFailedError: {
    id: 'dashboard.AddExistingSafeDialog.validation.fetchFailedError',
    defaultMessage: `Could not fetch {type} details. Please check your connection and try again.`,
  },
  safeNameError: {
    id: 'dashboard.AddExistingSafeDialog.validation.safeNameError',
    defaultMessage: 'Please enter a safe name',
  },
  moduleAddressError: {
    id: 'dashboard.AddExistingSafeDialog.validation.moduleAddressError',
    defaultMessage: 'Please enter a module address',
  },
  moduleNotConnectedError: {
    id: 'dashboard.AddExistingSafeDialog.validation.moduleNotConnectedError',
    defaultMessage: `Module not connected to safe on {selectedChain}`,
  },
  moduleNotFoundError: {
    id: 'dashboard.AddExistingSafeDialog.validation.moduleNotFoundError',
    defaultMessage: `Module not found on {selectedChain}`,
  },
});

type LoadingState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
type AbortControllerState = [
  AbortController | undefined,
  React.Dispatch<React.SetStateAction<AbortController | undefined>>,
];

const handleTestCompletion = (
  result: true | yup.ValidationError,
  loadingState: LoadingState,
): Promise<true | yup.ValidationError> => {
  const isFetchAborted = result !== true && result.message === FETCH_ABORTED;
  const [, setIsLoadingState] = loadingState;

  if (!isFetchAborted) {
    setIsLoadingState(false);
    return new Promise((res) => res(result));
  }
  // If fetching was aborted, don't show error.
  return new Promise((res) => res(true));
};

export const getValidationSchema = (
  stepIndex: number,
  abortControllerState: AbortControllerState,
  safes: ColonySafe[],
  loadingSafeState: LoadingState,
  loadingModuleState: LoadingState,
) => {
  const { formatMessage } = intl;
  const [abortController, setAbortController] = abortControllerState;
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

  return yup.object().shape({
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
            return handleTestCompletion(result, loadingSafeState);
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
            return handleTestCompletion(result, loadingModuleState);
          });
        },
      ),
  });
};
