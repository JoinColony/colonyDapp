import React from 'react';
import { defineMessages } from 'react-intl';

import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import { Select, Textarea } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';

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
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const ContractInteractionSection = ({
  disabledInput,
  transactionFormIndex,
}: Props) => {
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
          {/* @TODO: Connect available contract functions data with picker */}
          <Select
            label={MSG.functionLabel}
            name={`transactions.${transactionFormIndex}.contractFunction`}
            appearance={{ theme: 'grey', width: 'fluid' }}
            placeholder={MSG.functionPlaceholder}
            disabled={disabledInput}
          />
        </div>
      </DialogSection>
    </>
  );
};

ContractInteractionSection.displayName = displayName;

export default ContractInteractionSection;
