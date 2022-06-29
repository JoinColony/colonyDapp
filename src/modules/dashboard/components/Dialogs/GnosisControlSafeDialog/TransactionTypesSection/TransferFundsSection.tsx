import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import {
  AnyUser,
  Colony,
  useMembersSubscription,
  useNetworkContracts,
} from '~data/index';
import { Address } from '~types/index';
import { AmountTokens } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';

import { FormValues } from '../GnosisControlSafeDialog';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  amount: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.TransferFundsSection.amount`,
    defaultMessage: 'Amount',
  },
  recipient: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.TransferFundsSection.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.TransferFundsSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
});

const displayName = `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.TransferFundsSection`;

interface Props {
  colony: Colony;
  disabledInput: boolean;
  values: FormValues;
  back?: () => void;
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const TransferFundsSection = ({
  colony: { tokens, colonyAddress },
  disabledInput,
  values,
}: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });
  const { feeInverse: networkFeeInverse } = useNetworkContracts();

  const selectedToken = useMemo(
    () => tokens.find((token) => token.address === values.tokenAddress),
    [tokens, values.tokenAddress],
  );

  return (
    <>
      <DialogSection>
        <AmountTokens
          values={values}
          networkFeeInverse={networkFeeInverse}
          selectedToken={selectedToken}
          tokens={tokens}
          disabledInput={disabledInput}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.singleUserPickerContainer}>
          <SingleUserPicker
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.recipient}
            name="recipient"
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
            valueDataTest="paymentRecipientName"
          />
        </div>
      </DialogSection>
    </>
  );
};

TransferFundsSection.displayName = displayName;

export default TransferFundsSection;
