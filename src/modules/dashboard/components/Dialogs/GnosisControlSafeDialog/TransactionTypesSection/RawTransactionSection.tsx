import React from 'react';
import { defineMessages } from 'react-intl';

import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import { Address } from '~types/index';
import { Input } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  valueLabel: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.RawTransactionSection.valueLabel`,
    defaultMessage: 'Value <span>wei</span>',
  },
  dataLabel: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.RawTransactionSection.dataLabel`,
    defaultMessage: 'Data <span>bytes</span>',
  },
  recipient: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.RawTransactionSection.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.RawTransactionSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
});

const displayName = `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.RawTransactionSection`;

interface Props {
  colony: Colony;
  disabledInput: boolean;
  transactionFormIndex: number;
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const RawTransactionSection = ({
  colony: { colonyAddress },
  disabledInput,
  transactionFormIndex,
}: Props) => {
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
            renderAvatar={renderAvatar}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.valueLabel}
          name={`transactions.${transactionFormIndex}.amount`}
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
