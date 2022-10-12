import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { FormikProps } from 'formik';
import { isAddress } from 'web3-utils';

import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import { Input, Select, SelectOption, Textarea } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getContractUsefulMethods,
  AbiItemExtended,
  fetchContractABI,
} from '~utils/safes';
import { SpinnerLoader } from '~core/Preloaders';
import { isEmpty, isEqual, isNil } from '~utils/lodash';
import { getChainNameFromSafe } from '~modules/dashboard/sagas/utils/safeHelpers';

import { FormValues, FormProps, TransactionSectionProps } from '..';

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
    defaultMessage: `Contract could not be verified. Ensure it exists on {network}.`,
  },
  invalidAddressError: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.invalidAddressError`,
    defaultMessage: `Contract address is not a valid address.`,
  },
  fetchFailedError: {
    id: `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection.fetchFailedError`,
    defaultMessage: `Unable to fetch contract. Please check your connection.`,
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
  handleValidation: () => void;
  removeSelectedContractMethod: (index: number) => void;
}

interface ABIResponse {
  status: string;
  message: string;
  result: string;
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const ContractInteractionSection = ({
  disabledInput,
  transactionFormIndex,
  values,
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
  const [fetchABIError, setFetchABIError] = useState<string>('');

  const transactionValues = values.transactions[transactionFormIndex];

  const selectedSafe = safes.find(
    (safe) => safe.contractAddress === values.safe?.profile?.walletAddress,
  );

  const { contract: selectedContract } = values.transactions[
    transactionFormIndex
  ];

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
            network: getChainNameFromSafe(values.safe!.profile.displayName),
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
      values.safe,
      setFieldValue,
      transactionValues.abi,
      removeSelectedContractMethod,
      handleValidation,
      formatMessage,
    ],
  );

  const onContractChange = useCallback(
    (contract: AnyUser) => {
      setIsLoadingABI(true);
      setFetchABIError('');
      if (selectedSafe && isAddress(contract.profile.walletAddress)) {
        const contractPromise = fetchContractABI(
          contract.profile.walletAddress,
          Number(selectedSafe.chainId),
        );
        contractPromise.then((data) => {
          setIsLoadingABI(false);
          if (data) {
            onContractABIChange(data);
          } else {
            setFetchABIError(formatMessage(MSG.fetchFailedError));
          }
        });
      } else {
        if (!isAddress(contract.profile.walletAddress)) {
          setFetchABIError(formatMessage(MSG.invalidAddressError));
        } else {
          setFetchABIError(formatMessage(MSG.noSafeSelectedError));
        }
        setIsLoadingABI(false);
      }
    },
    [selectedSafe, onContractABIChange, formatMessage],
  );

  const usefulMethods: AbiItemExtended[] = useMemo(
    () => getContractUsefulMethods(transactionValues.abi),
    [transactionValues.abi],
  );

  useEffect(() => {
    if (
      transactionValues.contract &&
      selectedSafe &&
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
    return (
      <DialogSection>
        <div className={styles.spinner}>
          <SpinnerLoader
            appearance={{ size: 'medium' }}
            loadingText={MSG.loadingContract}
          />
        </div>
      </DialogSection>
    );
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
            renderAvatar={renderAvatar}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            onSelected={onContractChange}
            // handled instead in effect
            validateOnChange={false}
          />
        </div>
      </DialogSection>
      {fetchABIError ? (
        <DialogSection>
          <div className={styles.error}>{fetchABIError}</div>
        </DialogSection>
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
