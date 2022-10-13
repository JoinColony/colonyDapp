import React from 'react';
import { defineMessages } from 'react-intl';

import { useMembersSubscription } from '~data/index';
import { Input } from '~core/Fields';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';

import { TransactionSectionProps } from '..';
import { XsUserAvatar, displayName } from '.';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  valueLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.RawTransactionSection.valueLabel`,
    defaultMessage: 'Value <span>wei</span>',
  },
  dataLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.RawTransactionSection.dataLabel`,
    defaultMessage: 'Data <span>bytes</span>',
  },
  recipient: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.RawTransactionSection.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.RawTransactionSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
});

const RawTransactionSection = ({
  colony: { colonyAddress },
  disabledInput,
  transactionFormIndex,
  handleInputChange,
}: Omit<TransactionSectionProps, 'handleValidation'>) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  return (
    <>
      <DialogSection>
        <div className={styles.singleUserPickerContainer}>
          <SingleUserPicker
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.recipient}
            name={`transactions.${transactionFormIndex}.recipient`}
            filter={filterUserSelection}
            renderAvatar={XsUserAvatar}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            validateOnChange
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.valueLabel}
          name={`transactions.${transactionFormIndex}.rawAmount`}
          onChange={handleInputChange}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          labelValues={{
            span: (chunks) => (
              <span className={styles.labelDescription}>{chunks}</span>
            ),
          }}
          formattingOptions={{
            numeral: true,
            numeralPositiveOnly: true,
            numeralDecimalScale: 0,
          }}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Input
          label={MSG.dataLabel}
          name={`transactions.${transactionFormIndex}.data`}
          onChange={handleInputChange}
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={disabledInput}
          labelValues={{
            span: (chunks) => (
              <span className={styles.labelDescription}>{chunks}</span>
            ),
          }}
        />
      </DialogSection>
    </>
  );
};

RawTransactionSection.displayName = `${displayName}.RawTransactionSection`;

export default RawTransactionSection;
