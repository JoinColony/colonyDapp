import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

import { AnyUser, ColonySafe } from '~data/index';
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

import { FormValues } from '../ControlSafeDialog';

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
  setStatus: (status?: any) => void;
  status: any;
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
  setStatus,
  status,
  selectedContractMethods = {},
  handleSelectedContractMethods,
  safes,
}: Props) => {
  const [formattedMethodOptions, setFormattedMethodOptions] = useState<
    SelectOption[]
  >([]);
  const [currentSafeChainId, setCurrentSafeChainId] = useState<number>();

  const transactionValues = values.transactions[transactionFormIndex];

  const selectedSafe = safes.find(
    (safe) => safe.contractAddress === values.safe?.profile?.walletAddress,
  );

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
        );

        const updatedSelectedContractMethods = omit(
          selectedContractMethods,
          transactionFormIndex,
        );

        if (!isEqual(updatedSelectedContractMethods, selectedContractMethods)) {
          handleSelectedContractMethods(updatedSelectedContractMethods);
          setFieldValue(
            `transactions.${transactionFormIndex}.contractFunction`,
            '',
          );
        }
      }

      if (abiResponse.status !== '0') {
        setStatus(undefined);
      }
    },
    [
      transactionFormIndex,
      setFieldValue,
      setStatus,
      status,
      transactionValues.abi,
      selectedContractMethods,
      selectedSafe,
      handleSelectedContractMethods,
    ],
  );

  const onContractChange = useCallback(
    (contract: AnyUser) => {
      const contractPromise = fetchContractABI(
        contract.profile.walletAddress,
        Number(selectedSafe?.chainId),
      );
      contractPromise.then((data) => {
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
            onSelected={onContractChange}
          />
        </div>
      </DialogSection>
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
      ))}
    </>
  );
};

ContractInteractionSection.displayName = displayName;

export default ContractInteractionSection;
