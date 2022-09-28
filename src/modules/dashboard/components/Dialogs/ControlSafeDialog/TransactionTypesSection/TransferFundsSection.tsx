import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import moveDecimal from 'move-decimal-point';
import { AddressZero } from 'ethers/constants';
import { bigNumberify } from 'ethers/utils';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import { Address } from '~types/index';
import UserAvatar from '~core/UserAvatar';
import { SpinnerLoader } from '~core/Preloaders';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getChainNameFromSafe,
  getTxServiceBaseUrl,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

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
  balancesLoading: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.balancesLoading`,
    defaultMessage: 'Loading Safe balances',
  },
  balancesError: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.balancesError`,
    defaultMessage:
      'Unable to fetch the Safe balances. Please check your connection.',
  },
  noBalance: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.noBalance`,
    defaultMessage: 'Insufficient safe balance.',
  },
});

const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection`;

interface Props {
  colony: Colony;
  disabledInput: boolean;
  values: FormValues;
  transactionFormIndex: number;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  customAmountError: MessageDescriptor | string | undefined;
  handleCustomAmountError: React.Dispatch<
    React.SetStateAction<MessageDescriptor | string | undefined>
  >;
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
  customAmountError,
  handleCustomAmountError,
}: Props) => {
  const [safeBalances, setSafeBalances] = useState<SafeBalance[] | null>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(true);
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const safeAddress = values.safe?.profile?.walletAddress;
  const { amount } = values.transactions[transactionFormIndex];

  const getSafeBalance = useCallback(async () => {
    if (values.safe?.profile?.displayName) {
      setIsLoadingBalances(true);
      try {
        const chainName = getChainNameFromSafe(values.safe.profile.displayName);
        const baseUrl = getTxServiceBaseUrl(chainName);
        const response = await fetch(
          `${baseUrl}api/v1/safes/${safeAddress}/balances/`,
        );
        if (response.status === 200) {
          const data = await response.json();
          setSafeBalances(data);
        }
      } catch (e) {
        setSafeBalances(null);
        console.error(e);
      } finally {
        setIsLoadingBalances(false);
      }
    }
  }, [values.safe, safeAddress]);

  const selectedToken = values.transactions[transactionFormIndex].token;
  const selectedBalance = useMemo(
    () =>
      safeBalances?.find(
        (balance) =>
          balance.tokenAddress === selectedToken?.address ||
          (!balance.tokenAddress && selectedToken?.address === AddressZero),
      ),
    [safeBalances, selectedToken],
  );
  const selectedSafe = safes.find(
    (safe) => safe.contractAddress === values.safe?.profile?.walletAddress,
  );

  useEffect(() => {
    if (safeAddress) {
      getSafeBalance();
    }
  }, [safeAddress, getSafeBalance]);

  const formattedSafeBalance = moveDecimal(
    selectedBalance?.balance || 0,
    -(selectedBalance?.token?.decimals || DEFAULT_TOKEN_DECIMALS),
  );

  useEffect(() => {
    if (selectedToken && amount) {
      const decimals = getTokenDecimalsWithFallback(
        selectedToken && selectedToken.decimals,
      );
      const convertedAmount = bigNumberify(moveDecimal(amount, decimals));
      const safeBalance = bigNumberify(selectedBalance?.balance || 0);

      if (
        safeBalance &&
        (safeBalance.lt(convertedAmount) || safeBalance.isZero())
      ) {
        handleCustomAmountError(MSG.noBalance);
      } else {
        handleCustomAmountError(undefined);
      }
    }
  }, [
    amount,
    selectedToken,
    selectedBalance,
    transactionFormIndex,
    handleCustomAmountError,
  ]);

  if (isLoadingBalances) {
    return (
      <DialogSection>
        <div className={styles.balanceLoading}>
          <SpinnerLoader
            appearance={{ size: 'medium' }}
            loadingText={MSG.balancesLoading}
          />
        </div>
      </DialogSection>
    );
  }

  if (safeBalances === null) {
    return (
      <DialogSection>
        <div className={styles.balanceError}>
          <FormattedMessage {...MSG.balancesError} />
        </div>
      </DialogSection>
    );
  }

  return (
    <>
      <DialogSection>
        <AmountBalances
          values={values}
          selectedSafe={selectedSafe}
          safeBalances={safeBalances}
          disabledInput={disabledInput}
          inputName={`transactions.${transactionFormIndex}.amount`}
          selectorName={`transactions.${transactionFormIndex}.token`}
          maxButtonParams={{
            fieldName: `transactions.${transactionFormIndex}.amount`,
            maxAmount: `${formattedSafeBalance}`,
            setFieldValue,
          }}
          customAmountError={customAmountError}
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
