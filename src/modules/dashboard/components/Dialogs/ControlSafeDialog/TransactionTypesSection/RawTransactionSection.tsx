import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useField } from 'formik';

import { useMembersSubscription } from '~data/index';
import { Input } from '~core/Fields';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';

import { TransactionSectionProps } from '..';
import { AvatarXS } from './shared';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  valueLabel: {
    id: `dashboard.ControlSafeDialog.RawTransactionSection.valueLabel`,
    defaultMessage: 'Value <span>wei</span>',
  },
  dataLabel: {
    id: `dashboard.ControlSafeDialog.RawTransactionSection.dataLabel`,
    defaultMessage: 'Data <span>bytes</span>',
  },
  recipient: {
    id: `dashboard.ControlSafeDialog.RawTransactionSection.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.RawTransactionSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
});

const displayName = `dashboard.ControlSafeDialog.RawTransactionSection`;

const RawTransactionSection = ({
  colony: { colonyAddress },
  disabledInput,
  transactionFormIndex,
  handleInputChange,
  handleValidation,
}: TransactionSectionProps) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const [{ value: recipient }] = useField(
    `transactions.${transactionFormIndex}.recipient`,
  );

  // Effect needed to ensure form can't be submitted when recipient empty.
  useEffect(() => {
    if (recipient === null) {
      handleValidation();
    }
  }, [recipient, handleValidation]);

  return (
    <>
      <DialogSection>
        <div className={styles.singleUserPickerContainer}>
          <SingleUserPicker
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.recipient}
            name={`transactions.${transactionFormIndex}.recipient`}
            filter={filterUserSelection}
            renderAvatar={AvatarXS}
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

RawTransactionSection.displayName = displayName;

export default RawTransactionSection;
