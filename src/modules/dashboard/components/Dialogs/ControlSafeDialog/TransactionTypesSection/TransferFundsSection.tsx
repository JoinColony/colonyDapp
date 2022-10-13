import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormikProps, useField } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import moveDecimal from 'move-decimal-point';
import { AddressZero } from 'ethers/constants';

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
import { getSelectedSafeBalance } from '~utils/safes';
import { log } from '~utils/debug';

import AmountBalances from '../AmountBalances';
import { FormValues, TransactionSectionProps } from '..';

import styles from './TransactionTypesSection.css';

export const MSG = defineMessages({
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
      'Unable to fetch Safe balances. Please check your connection',
  },
  noSafeSelectedError: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection.noSafeSelectedError`,
    defaultMessage: 'You must first select a safe',
  },
});

const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.TransferFundsSection`;

export interface TransferFundsProps extends TransactionSectionProps {
  handleValidation: () => void;
  savedTokenState: [{}, React.Dispatch<React.SetStateAction<{}>>];
}

const renderAvatar = (address: Address, item: AnyUser) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const Loading = () => (
  <DialogSection>
    <div className={styles.spinner}>
      <SpinnerLoader
        appearance={{ size: 'medium' }}
        loadingText={MSG.balancesLoading}
      />
    </div>
  </DialogSection>
);

Loading.displayName = `${displayName}.Loading`;

export type ErrorMsgType = MessageDescriptor | string;
interface ErrorProps {
  error: ErrorMsgType;
}

const Error = ({ error }: ErrorProps) => (
  <DialogSection>
    <div className={styles.error}>
      {typeof error === 'string' ? (
        <span>{error}</span>
      ) : (
        <FormattedMessage {...error} />
      )}
    </div>
  </DialogSection>
);

Error.displayName = `${displayName}.Error`;

export { Loading, Error };

const TransferFundsSection = ({
  colony: { colonyAddress, safes },
  disabledInput,
  values: { safe },
  values,
  transactionFormIndex,
  setFieldValue,
  handleInputChange,
  handleValidation,
  savedTokenState,
}: TransferFundsProps &
  Pick<FormikProps<FormValues>, 'setFieldValue' | 'values'>) => {
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<ErrorMsgType>('');
  const [prevSafeAddress, setPrevSafeAddress] = useState<string>('');
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
    values.transactions[transactionFormIndex].tokenAddress;

  const selectedBalance = useMemo(
    () => getSelectedSafeBalance(safeBalances, selectedTokenAddress),
    [safeBalances, selectedTokenAddress],
  );
  const selectedSafe = safes.find(
    (s) => s.contractAddress === safe?.profile.walletAddress,
  );

  useEffect(() => {
    if (prevSafeAddress && safeAddress && prevSafeAddress !== safeAddress) {
      /*
       * Reset state of token address. This ensures token is always preselected because native token will always be
       * present in tokenData.
       * But, don't do so the first time the component renders (when prevSafeAddress === '').
       * This preserves token state after tab removal.
       */
      setFieldValue(
        `transactions.${transactionFormIndex}.tokenAddress`,
        AddressZero,
      );
      handleValidation();
    }
    // including index will cause token to reset when a tab is removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress, prevSafeAddress, setFieldValue, handleValidation]);

  useEffect(() => {
    if (safeAddress) {
      const savedTokenData = savedTokens[safeAddress];

      setPrevSafeAddress(safeAddress);
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

  useEffect(() => {
    if (!safeAddress) {
      setBalanceError(MSG.noSafeSelectedError);
    }
    // initialisation only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedSafeBalance = moveDecimal(
    selectedBalance?.balance || 0,
    -(selectedBalance?.token?.decimals || DEFAULT_TOKEN_DECIMALS),
  );

  if (isLoadingBalances) {
    return <Loading />;
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
