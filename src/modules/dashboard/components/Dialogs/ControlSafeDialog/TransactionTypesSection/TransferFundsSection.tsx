import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormikProps, useField } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import moveDecimal from 'move-decimal-point';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useMembersSubscription } from '~data/index';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import { DialogSection } from '~core/Dialog';
import {
  getChainNameFromSafe,
  getTxServiceBaseUrl,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { getColonySafe, getSelectedSafeBalance } from '~utils/safes';
import { log } from '~utils/debug';
import { Message } from '~types/index';

import AmountBalances from '../AmountBalances';
import { FormValues, TransactionSectionProps } from '..';
import { ErrorMessage as Error, Loading, AvatarXS } from './shared';

import styles from './TransactionTypesSection.css';
import Icon from '~core/Icon';

export const MSG = defineMessages({
  amount: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.amount`,
    defaultMessage: 'Amount',
  },
  recipient: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
  balancesLoading: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.balancesLoading`,
    defaultMessage: 'Loading Safe balances',
  },
  balancesError: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.balancesError`,
    defaultMessage:
      'Unable to fetch Safe balances. Please check your connection',
  },
  warning: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.warning`,
    defaultMessage: `Please confirm that the recipient’s address exists on the same chain as the selected Safe: <span>{safeChainName}</span>`,
  },
  warningIconTitle: {
    id: `dashboard.ControlSafeDialog.TransferFundsSection.warningIconTitle`,
    defaultMessage: 'Warning!',
  },
});

const displayName = `dashboard.ControlSafeDialog.TransferFundsSection`;

export interface TransferFundsProps extends TransactionSectionProps {
  savedTokenState: [{}, React.Dispatch<React.SetStateAction<{}>>];
}

const TransferFundsSection = ({
  colony: { colonyAddress, safes },
  disabledInput,
  values: { safe, transactions },
  transactionFormIndex,
  setFieldValue,
  handleInputChange,
  handleValidation,
  savedTokenState,
  setFieldTouched,
}: TransferFundsProps &
  Pick<
    FormikProps<FormValues>,
    'setFieldValue' | 'values' | 'setFieldTouched'
  >) => {
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<Message>('');
  const [savedTokens, setSavedTokens] = savedTokenState;
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });
  const [{ value: safeBalances }, , { setValue: setSafeBalances }] = useField<
    FormValues['safeBalances']
  >(`safeBalances`);

  const safeAddress = safe?.profile.walletAddress;

  const getSafeBalance = useCallback(async () => {
    setBalanceError('');
    if (safe) {
      setIsLoadingBalances(true);
      try {
        const chainName = getChainNameFromSafe(safe.profile.displayName);
        const baseUrl = getTxServiceBaseUrl(chainName);
        const response = await fetch(
          `${baseUrl}/v1/safes/${safeAddress}/balances/`,
        );
        if (response.status === 200) {
          const data = await response.json();
          setSavedTokens((tokens) => ({
            ...tokens,
            [safeAddress as string]: data,
          }));
          setSafeBalances(data);
        }
      } catch (e) {
        setBalanceError(MSG.balancesError);
        log.error(e);
      } finally {
        setIsLoadingBalances(false);
      }
    }
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe, safeAddress, setSavedTokens]);

  const selectedTokenAddress =
    transactions[transactionFormIndex].tokenData?.address;

  const selectedBalance = useMemo(
    () => getSelectedSafeBalance(safeBalances, selectedTokenAddress),
    [safeBalances, selectedTokenAddress],
  );
  const selectedSafe = getColonySafe(safes, safe);

  useEffect(() => {
    if (safeAddress) {
      const savedTokenData = savedTokens[safeAddress];
      if (savedTokenData) {
        setSafeBalances(savedTokenData);
        setBalanceError('');
      } else {
        getSafeBalance();
      }
    }
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress, getSafeBalance, savedTokens]);

  const formattedSafeBalance = moveDecimal(
    selectedBalance?.balance || 0,
    -(selectedBalance?.token?.decimals || DEFAULT_TOKEN_DECIMALS),
  );

  if (isLoadingBalances) {
    return <Loading message={MSG.balancesLoading} />;
  }

  if (balanceError) {
    return <Error error={balanceError} />;
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
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.warningContainer}>
          <Icon
            name="triangle-warning"
            className={styles.warningIcon}
            title={MSG.warningIconTitle}
          />
          <p>
            <FormattedMessage
              {...MSG.warning}
              values={{
                span: (chunks) => (
                  <span className={styles.warningSafeChainName}>{chunks}</span>
                ),
                safeChainName:
                  safe && getChainNameFromSafe(safe.profile.displayName),
              }}
            />
          </p>
        </div>
      </DialogSection>
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
