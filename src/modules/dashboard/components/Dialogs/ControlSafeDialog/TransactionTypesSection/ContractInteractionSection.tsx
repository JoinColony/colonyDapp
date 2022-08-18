import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import { Input, Select, SelectOption, Textarea } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  AbiItemExtended,
  useContractABIParser,
} from '~modules/dashboard/hooks/useContractABIParser';

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
  selectedContractMethod: AbiItemExtended | undefined;
  handleSelectedContractMethod: React.Dispatch<
    React.SetStateAction<AbiItemExtended | undefined>
  >;
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const ContractInteractionSection = ({
  disabledInput,
  transactionFormIndex,
  values,
  setFieldValue,
  selectedContractMethod,
  handleSelectedContractMethod,
}: Props) => {
  const [formattedMethodOptions, setFormattedMethodOptions] = useState<
    SelectOption[]
  >([]);
  const transactionValues = values.transactions[transactionFormIndex];
  const { contractABI, usefulMethods } = useContractABIParser(
    transactionValues.contract?.profile?.walletAddress,
  );
  useEffect(() => {
    setFieldValue(`transactions.${transactionFormIndex}.abi`, contractABI);

    const updatedFormattedMethodOptions =
      usefulMethods?.map((method) => {
        return {
          label: method.name,
          value: method.name,
        };
      }) || [];

    setFormattedMethodOptions(updatedFormattedMethodOptions);
  }, [contractABI, usefulMethods, transactionFormIndex, setFieldValue]);
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
              handleSelectedContractMethod(
                usefulMethods?.find((method) => method.name === value),
              );
            }}
          />
        </div>
      </DialogSection>
      {selectedContractMethod?.inputs?.map((input) => (
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
            />
          </div>
        </DialogSection>
      ))}
    </>
  );
};

ContractInteractionSection.displayName = displayName;

export default ContractInteractionSection;
