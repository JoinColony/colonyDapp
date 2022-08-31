import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

import { GNOSIS_NETWORK } from '~constants';
import { AnyUser, ColonySafe } from '~data/index';
import { Address } from '~types/index';
import { Input, Select, SelectOption, Textarea } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getContractUsefulMethods,
  AbiItemExtended,
} from '~utils/getContractUsefulMethods';

import { FormValues } from '../GnosisControlSafeDialog';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  abiLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.ContractInteractionSection.abiLabel`,
    defaultMessage: 'ABI/JSON',
  },
  functionLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.ContractInteractionSection.functionLabel`,
    defaultMessage: 'Select function to interact with',
  },
  functionPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.ContractInteractionSection.functionPlaceholder`,
    defaultMessage: 'Select function',
  },
  contractLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.ContractInteractionSection.contractLabel`,
    defaultMessage: 'Target contract address',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.ContractInteractionSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a contract address',
  },
});

const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.ContractInteractionSection`;

interface Props {
  disabledInput: boolean;
  transactionFormIndex: number;
  values: FormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  selectedContractMethods:
    | {
        [key: number]: AbiItemExtended | undefined;
      }
    | undefined;
  handleSelectedContractMethods: React.Dispatch<
    React.SetStateAction<
      | {
          [key: number]: AbiItemExtended | undefined;
        }
      | undefined
    >
  >;
  safes: ColonySafe[];
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
}: Props) => {
  const [formattedMethodOptions, setFormattedMethodOptions] = useState<
    SelectOption[]
  >([]);
  const transactionValues = values.transactions[transactionFormIndex];
  const contractAddress = transactionValues.contract?.profile?.walletAddress;
  const onContractABIChange = useCallback(
    (abi: string) => {
      if (abi !== transactionValues.abi) {
        const updatedSelectedContractMethods = omit(
          selectedContractMethods,
          transactionFormIndex,
        );

        setFieldValue(`transactions.${transactionFormIndex}.abi`, abi);
        setFieldValue(
          `transactions.${transactionFormIndex}.contractFunction`,
          '',
        );
        handleSelectedContractMethods(updatedSelectedContractMethods);
      }
    },
    [
      transactionFormIndex,
      setFieldValue,
      transactionValues.abi,
      selectedContractMethods,
      handleSelectedContractMethods,
    ],
  );
  const selectedSafe = safes.find(
    (safe) => safe.contractAddress === values.safe?.profile?.walletAddress,
  );

  const usefulMethods: AbiItemExtended[] = useMemo(
    () =>
      getContractUsefulMethods(
        contractAddress,
        transactionValues.abi,
        Number(selectedSafe?.chainId) || GNOSIS_NETWORK.chainId,
        onContractABIChange,
      ),
    [transactionValues.abi, selectedSafe, onContractABIChange, contractAddress],
  );

  useEffect(() => {
    if (isEmpty(contractAddress) && !isEmpty(transactionValues.abi)) {
      onContractABIChange('');
    }
  }, [contractAddress, onContractABIChange, transactionValues.abi]);

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
  }, [
    usefulMethods,
    transactionFormIndex,
    setFieldValue,
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
      const updatedSelectedContractMethods = omit(
        selectedContractMethods,
        transactionFormIndex,
      );

      handleSelectedContractMethods(updatedSelectedContractMethods);
      setFieldValue(
        `transactions.${transactionFormIndex}.contractFunction`,
        '',
      );
    }
  }, [
    handleSelectedContractMethods,
    selectedContractMethods,
    usefulMethods,
    setFieldValue,
    transactionFormIndex,
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
          />
        </div>
      </DialogSection>
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
            }}
          />
        </div>
      </DialogSection>
      {selectedContractMethods[transactionFormIndex]?.inputs?.map((input) => (
        <DialogSection
          key={`${input.name}-${input.type}`}
          appearance={{ theme: 'sidePadding' }}
        >
          <div className={styles.inputParamContainer}>
            <Input
              label={`${input.name} (${input.type})`}
              name={`transactions.${transactionFormIndex}.${input.name}`}
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              disabled={disabledInput}
              placeholder={`${input.name} (${input.type})`}
              formattingOptions={
                input.type === 'uint256' || input.type === 'int256'
                  ? {
                      numeral: true,
                      numeralPositiveOnly: input.type === 'uint256',
                      numeralDecimalScale: 0,
                    }
                  : undefined
              }
            />
          </div>
        </DialogSection>
      ))}
    </>
  );
};

ContractInteractionSection.displayName = displayName;

export default ContractInteractionSection;
