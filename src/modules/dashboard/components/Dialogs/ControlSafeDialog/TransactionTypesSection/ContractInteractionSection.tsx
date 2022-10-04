import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { isEmpty, isEqual, isNil } from 'lodash';
import { FormikProps } from 'formik';

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
import { GNOSIS_NETWORK } from '~constants';
import { SpinnerLoader } from '~core/Preloaders';

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
});

const displayName = `dashboard.ControlSafeDialog.TransactionTypesSection.ContractInteractionSection`;

interface Props
  extends Pick<
      FormProps,
      'safes' | 'selectedContractMethods' | 'handleSelectedContractMethods'
    >,
    Pick<
      FormikProps<FormValues>,
      'setStatus' | 'setFieldValue' | 'values' | 'status'
    >,
    Omit<TransactionSectionProps, 'colony'> {
  handleValidation: () => void;
  removeSelectedContractMethods: (index: number) => void;
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const ContractInteractionSection = ({
  disabledInput,
  transactionFormIndex,
  values,
  setFieldValue,
  setStatus,
  status,
  selectedContractMethods = {},
  handleSelectedContractMethods,
  safes,
  handleValidation,
  handleInputChange,
  removeSelectedContractMethods,
}: Props) => {
  const [formattedMethodOptions, setFormattedMethodOptions] = useState<
    SelectOption[]
  >([]);
  const [currentSafeChainId, setCurrentSafeChainId] = useState<number>();
  const [isLoadingABI, setIsLoadingABI] = useState<boolean>(false);

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
    (abiResponse: any) => {
      if (abiResponse.status === '0') {
        if (
          Number(selectedSafe?.chainId) === GNOSIS_NETWORK.chainId &&
          status !== abiResponse.message
        ) {
          setStatus(abiResponse.message);
        } else if (
          Number(selectedSafe?.chainId) !== GNOSIS_NETWORK.chainId &&
          status !== abiResponse.result
        ) {
          setStatus(abiResponse.result);
        }
      } else if (
        !isNil(abiResponse.result) &&
        abiResponse.result !== transactionValues.abi
      ) {
        setFieldValue(
          `transactions.${transactionFormIndex}.abi`,
          abiResponse.result,
          true,
        );
        removeSelectedContractMethods(transactionFormIndex);
      }

      if (abiResponse.status !== '0') {
        setStatus(undefined);
      }

      handleValidation();
    },
    [
      transactionFormIndex,
      setFieldValue,
      setStatus,
      status,
      transactionValues.abi,
      selectedSafe,
      removeSelectedContractMethods,
      handleValidation,
    ],
  );

  const onContractChange = useCallback(
    (contract: AnyUser) => {
      setIsLoadingABI(true);
      const contractPromise = fetchContractABI(
        contract.profile.walletAddress,
        Number(selectedSafe?.chainId),
      );
      contractPromise.then((data) => {
        setIsLoadingABI(false);

        onContractABIChange(data);

        if (Number(selectedSafe?.chainId) !== currentSafeChainId) {
          setCurrentSafeChainId(Number(selectedSafe?.chainId));
        }
      });
    },
    [selectedSafe, currentSafeChainId, onContractABIChange],
  );

  const usefulMethods: AbiItemExtended[] = useMemo(
    () => getContractUsefulMethods(transactionValues.abi),
    [transactionValues.abi],
  );

  useEffect(() => {
    if (
      transactionValues.contract &&
      !isNil(selectedSafe) &&
      !isNil(currentSafeChainId) &&
      currentSafeChainId !== Number(selectedSafe.chainId)
    ) {
      onContractChange(transactionValues.contract);
    }
  }, [
    currentSafeChainId,
    selectedSafe,
    transactionValues.contract,
    onContractChange,
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
      removeSelectedContractMethods(transactionFormIndex);
    }
  }, [
    selectedContractMethods,
    usefulMethods,
    transactionFormIndex,
    removeSelectedContractMethods,
  ]);

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
      {isLoadingABI ? (
        <div className={styles.spinner}>
          <SpinnerLoader
            appearance={{ size: 'medium' }}
            loadingText={MSG.loadingContract}
          />
        </div>
      ) : (
        <>
          <DialogSection>
            <Textarea
              label={MSG.abiLabel}
              name={`transactions.${transactionFormIndex}.abi`}
              appearance={{ colorSchema: 'grey', resizable: 'vertical' }}
              disabled={disabledInput}
              status={status}
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
                    name={`transactions.${transactionFormIndex}.${input.name}(${input.type})-${selectedContractMethods[transactionFormIndex]?.name}`}
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
