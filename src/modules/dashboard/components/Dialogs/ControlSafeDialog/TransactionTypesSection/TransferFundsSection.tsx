import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';

import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import { Address } from '~types/index';
import UserAvatar from '~core/UserAvatar';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getChainNameFromSafe,
  getTxServiceBaseUrl,
} from '~modules/dashboard/sagas/utils/safeHelpers';

import AmountBalances, { SafeBalance } from '../AmountBalances';
import { FormValues } from '../ControlSafeDialog';

import styles from './TransactionTypesSection.css';

const MSG = defineMessages({
  amount: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.amount`,
    defaultMessage: 'Amount',
  },
  recipient: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
});

const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection`;

interface Props {
  colony: Colony;
  disabledInput: boolean;
  values: FormValues;
  transactionFormIndex: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const TransferFundsSection = ({
  colony: { colonyAddress, safes },
  disabledInput,
  values,
  transactionFormIndex,
  setFieldValue,
}: Props) => {
  const [safeBalances, setSafeBalances] = useState<SafeBalance[]>([]);
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const safeAddress = values.safe?.profile?.walletAddress;

  const getSafeBalance = useCallback(async () => {
    if (values.safe?.profile?.displayName) {
      const chainName = getChainNameFromSafe(values.safe.profile.displayName);
      const baseUrl = getTxServiceBaseUrl(chainName);
      try {
        const response = await fetch(
          `${baseUrl}api/v1/safes/${safeAddress}/balances/`,
        );
        if (response.status === 200) {
          const data = await response.json();
          setSafeBalances(data);
        }
      } catch (e) {
        setSafeBalances([]);
        console.error(e);
      }
    }
  }, [values.safe, safeAddress]);

  const selectedTokenAddress =
    values.transactions[transactionFormIndex].tokenAddress;
  const selectedBalance = useMemo(
    () =>
      safeBalances?.find(
        (balance) => balance.tokenAddress === selectedTokenAddress,
      ),
    [safeBalances, selectedTokenAddress],
  );
  const selectedSafe = safes.find(
    (safe) => safe.contractAddress === values.safe?.profile?.walletAddress,
  );

  useEffect(() => {
    if (safeAddress) {
      getSafeBalance();
    }
  }, [safeAddress, getSafeBalance]);

  return (
    <>
      <DialogSection>
        <AmountBalances
          values={values}
          selectedBalance={selectedBalance}
          selectedSafe={selectedSafe}
          safeBalances={safeBalances}
          disabledInput={disabledInput}
          inputName={`transactions.${transactionFormIndex}.amount`}
          selectorName={`transactions.${transactionFormIndex}.tokenAddress`}
          // @TODO: Connect max amount to max amount in safe
          maxButtonParams={{
            fieldName: `transactions.${transactionFormIndex}.amount`,
            maxAmount: `${selectedBalance?.balance || 0}`,
            setFieldValue,
          }}
        />
      </DialogSection>
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
