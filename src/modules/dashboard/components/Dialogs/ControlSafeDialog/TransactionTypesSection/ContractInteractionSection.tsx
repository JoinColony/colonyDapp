import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
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

import { FormValues, FormProps, TransactionSectionProps } from '..';
import { ErrorMessage as Error, Loading, UserAvatarXs } from './shared';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  abiLabel: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.abiLabel`,
    defaultMessage: 'ABI/JSON',
  },
  functionLabel: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.functionLabel`,
    defaultMessage: 'Select function to interact with',
  },
  functionPlaceholder: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.functionPlaceholder`,
    defaultMessage: 'Select function',
  },
  contractLabel: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.contractLabel`,
    defaultMessage: 'Target contract address',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a contract address',
  },
  loadingContract: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.loadingContract`,
    defaultMessage: 'Loading Contract',
  },
  noSafeSelectedError: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.noSafeSelectedError`,
    defaultMessage: `You must select a safe before fetching the contract's ABI`,
  },
  contractNotVerifiedError: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.contractNotVerifiedError`,
    defaultMessage: `Contract could not be verified. Ensure it exists on {network}`,
  },
  invalidAddressError: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.invalidAddressError`,
    defaultMessage: `Contract address is not a valid address`,
  },
  fetchFailedError: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.fetchFailedError`,
    defaultMessage: `Unable to fetch contract. Please check your connection`,
  },
});

const displayName = `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection`;

interface Props
  extends Pick<
      FormProps,
      'safes' | 'selectedContractMethods' | 'handleSelectedContractMethods'
    >,
    Pick<FormikProps<FormValues>, 'setFieldValue' | 'values'>,
    Omit<TransactionSectionProps, 'colony'> {
  removeSelectedContractMethod: (index: number) => void;
}

interface ABIResponse {
  status: string;
  message: string;
  result: string;
}

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
          setFetchABIError(formatMessage(MSG.fetchFailedError));
        }

        const contractName = await fetchContractName(
          contract.profile.walletAddress,
          Number(selectedSafe?.chainId),
        );

        setFieldValue(
          `transactions.${transactionFormIndex}.contract.profile.displayName`,
          contractName || 'Unknown contract',
        );
        setIsLoadingABI(false);
      } else {
        if (!isAddress(contract.profile.walletAddress)) {
          setFetchABIError(MSG.invalidAddressError);
        } else {
          setFetchABIError(MSG.noSafeSelectedError);
        }
        setFieldValue(
          `transactions.${transactionFormIndex}.contract.profile.displayName`,
          'Unknown contract',
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

  useEffect(() => {
    if (!selectedSafe) {
      setPrevSafeChainId('');
    } else if (
      transactionValues.contract &&
      // only run effect if safe chain changes
      prevSafeChainId !== selectedSafe.chainId
    ) {
      setPrevSafeChainId(selectedSafe.chainId);
      onContractChange(transactionValues.contract);
    }
  }, [
    selectedSafe,
    transactionValues.contract,
    onContractChange,
    prevSafeChainId,
  ]);

  useEffect(() => {
    const updatedFormattedMethodOptions =
      usefulMethods?.map((method) => {
        return {
          label: method.name,
          value: method.name,
        };
      }) || [];

    if (!isEqual(updatedFormattedMethodOptions, formattedMethodOptions)) {
      setFormattedMethodOptions(updatedFormattedMethodOptions);
    }
  }, [usefulMethods, transactionFormIndex, formattedMethodOptions]);

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

  if (isLoadingABI) {
    return <Loading message={MSG.loadingContract} />;
  }

  return (
    <>
      <DialogSection>
        <div className={styles.singleUserPickerContainer}>
          {/* @TODO: Connect available contract data with picker */}
          <SingleUserPicker
            data={[]}
            label={MSG.contractLabel}
            name={`transactions.${transactionFormIndex}.contract`}
            filter={filterUserSelection}
            renderAvatar={UserAvatarXs}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            onSelected={onContractChange}
            // handled instead in effect
            validateOnChange={false}
            showMaskedAddress
          />
        </div>
      </DialogSection>
      {fetchABIError ? (
        <Error error={fetchABIError} />
      ) : (
        <>
          <DialogSection>
            <Textarea
              label={MSG.abiLabel}
              name={`transactions.${transactionFormIndex}.abi`}
              appearance={{ colorSchema: 'grey', resizable: 'vertical' }}
              disabled={disabledInput}
            />
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.contractFunctionSelectorContainer}>
              {/*
               * This is the component we don't want to let Formik validate immediately on change.
               * Validation happens before the form state updates, which causes the form to be valid when
               * it shouldn't be.
               */}
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
                  handleSelectedContractMethods(updatedSelectedContractMethods);
                  handleValidation();
                }}
              />
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
