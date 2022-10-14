import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormikProps, useField } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import moveDecimal from 'move-decimal-point';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { AnyUser, useMembersSubscription } from '~data/index';
import { Address } from '~types/index';
import UserAvatar from '~core/UserAvatar';
import { SpinnerLoader } from '~core/Preloaders';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getChainNameFromSafe,
  getTxServiceBaseUrl,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { getSelectedSafeBalance } from '~utils/safes/safeBalances';

import AmountBalances, { SafeBalance } from '../AmountBalances';
import { FormValues, TransactionSectionProps } from '..';

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
      'Unable to fetch the Safe balances. Please check your connection',
  },
});

const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection`;

export interface TransferFundsProps extends TransactionSectionProps {
  handleValidation: () => void;
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
  handleInputChange,
  handleValidation,
  setFieldTouched,
}: TransferFundsProps &
  Pick<
    FormikProps<FormValues>,
    'setFieldValue' | 'values' | 'setFieldTouched'
  >) => {
  const [{ value: safeBalances }, , { setValue: setSafeBalances }] = useField<
    SafeBalance[] | null
  >(`safeBalances`);
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(true);
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const safeAddress = values.safe?.profile.walletAddress;

  const getSafeBalance = useCallback(async () => {
    if (values.safe?.profile.displayName) {
      setIsLoadingBalances(true);
      try {
        const chainName = getChainNameFromSafe(values.safe.profile.displayName);
        const baseUrl = getTxServiceBaseUrl(chainName);
        const response = await fetch(
          `${baseUrl}/v1/safes/${safeAddress}/balances/`,
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
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.safe, safeAddress]);

  const selectedTokenAddress =
    values.transactions[transactionFormIndex].tokenAddress;

  const selectedBalance = useMemo(
    () => getSelectedSafeBalance(safeBalances, selectedTokenAddress),
    [safeBalances, selectedTokenAddress],
  );
  const selectedSafe = safes.find(
    (safe) => safe.contractAddress === values.safe?.profile.walletAddress,
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

  if (isLoadingBalances) {
    return (
      <DialogSection>
        <div className={styles.spinner}>
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
          selectedSafe={selectedSafe}
          safeBalances={safeBalances}
          disabledInput={disabledInput}
          handleChange={handleInputChange}
          maxButtonParams={{
            fieldName: `transactions.${transactionFormIndex}.amount`,
            maxAmount: `${formattedSafeBalance}`,
            setFieldValue,
            customOnClickFn() {
              handleValidation();
              setTimeout(
                () =>
                  setFieldTouched(
                    `transactions.${transactionFormIndex}.amount`,
                    true,
                    false,
                  ),
                0,
              );
            },
          }}
          transactionFormIndex={transactionFormIndex}
          handleValidation={handleValidation}
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
            validateOnChange
          />
        </div>
      </DialogSection>
    </>
  );
};

TransferFundsSection.displayName = displayName;

export default TransferFundsSection;
