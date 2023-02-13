import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import { FormikProps } from 'formik';
import { isAddress } from 'web3-utils';

import { AnyUser } from '~data/index';
import { Input, Select, SelectOption, Textarea } from '~core/Fields';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getContractUsefulMethods,
  AbiItemExtended,
  fetchContractABI,
  fetchContractName,
  getColonySafe,
} from '~utils/safes';
import { isEmpty, isEqual, isNil } from '~utils/lodash';
import { getChainNameFromSafe } from '~modules/dashboard/sagas/utils/safeHelpers';
import { Message } from '~types/index';
import { isMessageDescriptor } from '~utils/strings';
import { BINANCE_NETWORK } from '~constants';

import {
  FormValues,
  FormProps,
  TransactionSectionProps,
  invalidSafeError,
  UpdatedMethods,
} from '..';
import { ErrorMessage as Error, Loading, AvatarXS } from './shared';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  abiLabel: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.abiLabel`,
    defaultMessage: 'ABI/JSON',
  },
  functionLabel: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.functionLabel`,
    defaultMessage: 'Select function to interact with',
  },
  functionPlaceholder: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.functionPlaceholder`,
    defaultMessage: 'Select function',
  },
  contractLabel: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.contractLabel`,
    defaultMessage: 'Target contract address',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a contract address',
  },
  loadingContract: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.loadingContract`,
    defaultMessage: 'Loading Contract',
  },
  contractNotVerifiedError: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.contractNotVerifiedError`,
    defaultMessage: `Contract could not be verified. Ensure it exists on {network}`,
  },
  invalidAddressError: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.invalidAddressError`,
    defaultMessage: `Contract address is not a valid address`,
  },
  fetchFailedError: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.fetchFailedError`,
    defaultMessage: `Unable to fetch contract. Please check your connection`,
  },
  noUsefulMethodsError: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.noUsefulMethodsError`,
    defaultMessage: `No external methods were found in this ABI`,
  },
  unknownContract: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.unknownContract`,
    defaultMessage: `Unknown contract`,
  },
  etherscanAttribution: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.etherscanAttribution`,
    defaultMessage: 'Powered by Etherscan.io APIs',
  },
  bscScanAttribution: {
    id: `dashboard.ControlSafeDialog.ContractInteractionSection.bscScanAttribution`,
    defaultMessage: 'Powered by BscScan APIs',
  },
});

const displayName = `dashboard.ControlSafeDialog.ContractInteractionSection`;

interface Props
  extends Pick<FormProps, 'safes' | 'selectedContractMethods'>,
    Pick<FormikProps<FormValues>, 'setFieldValue' | 'values' | 'isValid'>,
    Omit<TransactionSectionProps, 'colony'> {
  removeSelectedContractMethod: (index: number) => void;
  handleSelectedContractMethods: (
    selectedContractMethods: UpdatedMethods,
    index: number,
  ) => void;
}

interface ABIResponse {
  status: string;
  message: string;
  result: string;
}

const getAttributionMessage = (chainId: string | undefined) => {
  if (chainId === BINANCE_NETWORK.chainId.toString()) {
    return MSG.bscScanAttribution;
  }
  return MSG.etherscanAttribution;
};

const ContractInteractionSection = ({
  disabledInput,
  transactionFormIndex,
  values: { safe, transactions },
  setFieldValue,
  selectedContractMethods = {},
  handleSelectedContractMethods,
  safes,
  handleValidation,
  handleInputChange,
  removeSelectedContractMethod,
  isValid,
}: Props) => {
  const { formatMessage } = useIntl();

  const [formattedMethodOptions, setFormattedMethodOptions] = useState<
    SelectOption[]
  >([]);
  const [prevSafeChainId, setPrevSafeChainId] = useState<string>();
  const [isLoadingABI, setIsLoadingABI] = useState<boolean>(false);
  const [fetchABIError, setFetchABIError] = useState<Message>('');

  const transactionValues = transactions[transactionFormIndex];

  const selectedSafe = getColonySafe(safes, safe);

  const { contract: selectedContract } = transactions[transactionFormIndex];

  useEffect(() => {
    if (!selectedContract) {
      handleValidation();
    }
  }, [selectedContract, handleValidation]);

  const onContractABIChange = useCallback(
    (abiResponse: ABIResponse) => {
      if (abiResponse.status === '0') {
        setFetchABIError(
          formatMessage(MSG.contractNotVerifiedError, {
            // onContractABIChange is only called if a safe has been selected
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: getChainNameFromSafe(safe!.profile.displayName),
          }),
        );
      } else if (
        !isNil(abiResponse.result) &&
        abiResponse.result !== transactionValues.abi
      ) {
        setFieldValue(
          `transactions.${transactionFormIndex}.abi`,
          abiResponse.result,
          true,
        );
        removeSelectedContractMethod(transactionFormIndex);
      }

      handleValidation();
    },
    [
      transactionFormIndex,
      safe,
      setFieldValue,
      transactionValues.abi,
      removeSelectedContractMethod,
      handleValidation,
      formatMessage,
    ],
  );

  const onContractChange = useCallback(
    async (contract: AnyUser) => {
      setIsLoadingABI(true);
      setFetchABIError('');

      if (selectedSafe && isAddress(contract.profile.walletAddress)) {
        const contractABIData = await fetchContractABI(
          contract.profile.walletAddress,
          Number(selectedSafe.chainId),
        );

        if (contractABIData) {
          onContractABIChange(contractABIData);
        } else {
          setFetchABIError(MSG.fetchFailedError);
        }

        const contractName = await fetchContractName(
          contract.profile.walletAddress,
          Number(selectedSafe?.chainId),
        );

        setFieldValue(
          `transactions.${transactionFormIndex}.contract.profile.displayName`,
          contractName || formatMessage(MSG.unknownContract),
        );
        setIsLoadingABI(false);
      } else {
        const error = !isAddress(contract.profile.walletAddress)
          ? MSG.invalidAddressError
          : invalidSafeError;
        setFetchABIError(error);
        setFieldValue(
          `transactions.${transactionFormIndex}.contract.profile.displayName`,
          formatMessage(MSG.unknownContract),
        );
        setIsLoadingABI(false);
      }
    },
    [
      selectedSafe,
      onContractABIChange,
      formatMessage,
      setFieldValue,
      transactionFormIndex,
    ],
  );

  const usefulMethods: AbiItemExtended[] = useMemo(
    () => getContractUsefulMethods(transactionValues.abi),
    [transactionValues.abi],
  );

  const isSpecificError = (error: Message, comparison: MessageDescriptor) => {
    return (
      isMessageDescriptor(error) &&
      error.defaultMessage === comparison.defaultMessage
    );
  };

  useEffect(() => {
    if (
      transactionValues.contract &&
      safe &&
      // only run effect if safe chain changes or there was previously an error
      (prevSafeChainId !== selectedSafe?.chainId || fetchABIError)
    ) {
      if (selectedSafe) {
        setPrevSafeChainId(selectedSafe.chainId);
      }
      onContractChange(transactionValues.contract);
    }
    // Don't want to run when ABI error changes, or else cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    safe,
    selectedSafe,
    transactionValues.contract,
    onContractChange,
    prevSafeChainId,
  ]);

  useEffect(() => {
    const updatedFormattedMethodOptions =
      usefulMethods.map((method) => {
        return {
          label: method.name,
          value: method.name,
        };
      }) || [];

    if (!isEqual(updatedFormattedMethodOptions, formattedMethodOptions)) {
      setFormattedMethodOptions(updatedFormattedMethodOptions);
    }

    if (
      !fetchABIError && // so we don't override other errors
      transactionValues.abi &&
      !updatedFormattedMethodOptions.length
    ) {
      setFetchABIError(MSG.noUsefulMethodsError);
    }
  }, [
    fetchABIError,
    transactionValues.abi,
    usefulMethods,
    transactionFormIndex,
    formattedMethodOptions,
  ]);

  useEffect(() => {
    if (
      (isEmpty(usefulMethods) ||
        !usefulMethods?.find(
          (method) =>
            method.name === selectedContractMethods[transactionFormIndex]?.name,
        )) &&
      !isEmpty(selectedContractMethods[transactionFormIndex])
    ) {
      removeSelectedContractMethod(transactionFormIndex);
      handleValidation();
    }
  }, [
    selectedContractMethods,
    usefulMethods,
    transactionFormIndex,
    removeSelectedContractMethod,
    handleValidation,
  ]);

  // Ensures spinner doesn't show up when returning back from Preview
  if (isLoadingABI && !isValid) {
    return <Loading message={MSG.loadingContract} />;
  }

  return (
    <>
      <DialogSection>
        <div className={styles.singleUserPickerContainer}>
          <SingleUserPicker
            data={[]}
            label={MSG.contractLabel}
            name={`transactions.${transactionFormIndex}.contract`}
            filter={filterUserSelection}
            renderAvatar={AvatarXS}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            onSelected={onContractChange}
            // handled instead in effect
            validateOnChange={false}
            showMaskedAddress
          />
        </div>
      </DialogSection>
      {fetchABIError &&
      !isSpecificError(fetchABIError, MSG.noUsefulMethodsError) &&
      !isSpecificError(fetchABIError, MSG.fetchFailedError) ? (
        <Error error={fetchABIError} />
      ) : (
        <>
          <DialogSection>
            <div className={styles.abiContainer}>
              <Textarea
                label={MSG.abiLabel}
                name={`transactions.${transactionFormIndex}.abi`}
                appearance={{ colorSchema: 'grey', resizable: 'vertical' }}
                disabled={disabledInput}
              />
              {selectedSafe?.chainId && (
                <span className={styles.attributionMessage}>
                  <FormattedMessage
                    {...getAttributionMessage(selectedSafe.chainId)}
                  />
                </span>
              )}
            </div>
            {fetchABIError &&
              isSpecificError(fetchABIError, MSG.fetchFailedError) && (
                <div className={styles.fetchFailedErrorContainer}>
                  <Error error={fetchABIError} />
                </div>
              )}
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.contractFunctionSelectorContainer}>
              {fetchABIError &&
              isSpecificError(fetchABIError, MSG.noUsefulMethodsError) ? (
                <div className={styles.noUsefulMethods}>
                  <Error error={fetchABIError} />
                </div>
              ) : (
                /*
                 * This is the component we don't want to let Formik validate immediately on change.
                 * Validation happens before the form state updates, which causes the form to be valid when
                 * it shouldn't be.
                 */
                <Select
                  label={MSG.functionLabel}
                  name={`transactions.${transactionFormIndex}.contractFunction`}
                  appearance={{ theme: 'grey', width: 'fluid' }}
                  placeholder={MSG.functionPlaceholder}
                  disabled={disabledInput}
                  options={formattedMethodOptions}
                  onChange={(value) => {
                    const updatedSelectedContractMethods = {
                      ...selectedContractMethods,
                      [transactionFormIndex]: usefulMethods.find(
                        (method) => method.name === value,
                      ),
                    };
                    handleSelectedContractMethods(
                      updatedSelectedContractMethods,
                      transactionFormIndex,
                    );
                    handleValidation();
                  }}
                />
              )}
            </div>
          </DialogSection>
          {selectedContractMethods[transactionFormIndex]?.inputs?.map(
            (input) => (
              <DialogSection
                key={`${input.name}-${input.type}`}
                appearance={{ theme: 'sidePadding' }}
              >
                <div className={styles.inputParamContainer}>
                  <Input
                    label={`${input.name} (${input.type})`}
                    // eslint-disable-next-line max-len
                    name={`transactions.${transactionFormIndex}.${input.name}-${selectedContractMethods[transactionFormIndex]?.name}`}
                    appearance={{ colorSchema: 'grey', theme: 'fat' }}
                    disabled={disabledInput}
                    onChange={handleInputChange}
                    placeholder={`${input.name} (${input.type})`}
                    formattingOptions={
                      input.type.includes('int') &&
                      input.type.substring(input.type.length - 2) !== '[]'
                        ? {
                            numeral: true,
                            numeralPositiveOnly:
                              input.type.substring(0, 4) === 'uint',
                            numeralDecimalScale: 0,
                          }
                        : undefined
                    }
                  />
                </div>
              </DialogSection>
            ),
          )}
        </>
      )}
    </>
  );
};

ContractInteractionSection.displayName = displayName;

export default ContractInteractionSection;
