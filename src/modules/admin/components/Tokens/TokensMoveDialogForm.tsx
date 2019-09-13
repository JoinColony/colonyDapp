import React, { useMemo, useEffect, useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { COLONY_ROLE_FUNDING } from '@colony/colony-js-client';
import BigNumber from 'bn.js';
import { useMappedState } from 'redux-react-hook';

import { Address } from '~types/index';
import { DomainType } from '~immutable/index';
import { useDataFetcher, useUserDomainRoles, useSelector } from '~utils/hooks';
import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, FormStatus } from '~core/Fields';
import Heading from '~core/Heading';

import { domainsFetcher } from '../../../dashboard/fetchers';
import { tokenBalanceSelector } from '../../../dashboard/selectors';
import { walletAddressSelector } from '../../../users/selectors';

import styles from './TokensMoveDialog.css';
import { FormValues } from './TokensMoveDialog';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import { ZERO_ADDRESS } from '~utils/web3/constants';

const MSG = defineMessages({
  title: {
    id: 'admin.Tokens.TokensMoveDialog.title',
    defaultMessage: 'Move Funds',
  },
  from: {
    id: 'admin.Tokens.TokensMoveDialog.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'admin.Tokens.TokensMoveDialog.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'admin.Tokens.TokensMoveDialog.amount',
    defaultMessage: 'Amount',
  },
  domainTokenAmount: {
    id: 'admin.Tokens.TokensMoveDialog.domainTokenAmount',
    defaultMessage: 'Amount: {amount} {symbol}',
  },
  noBalance: {
    id: 'admin.Tokens.TokensMoveDialog.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
  noPermissionFrom: {
    id: 'admin.Tokens.TokensMoveDialog.noPermissionFrom',
    defaultMessage: 'No permission in from domain',
  },
  noPermissionTo: {
    id: 'admin.Tokens.TokensMoveDialog.noPermissionTo',
    defaultMessage: 'No permission in to domain',
  },
  samePot: {
    id: 'admin.Tokens.TokensMoveDialog.samePot',
    defaultMessage: 'Cannot move to same domain pot',
  },
});

interface Props {
  cancel: () => void;
  colonyAddress: Address;
  colonyTokenRefs: any;
  colonyTokens: any;
}

const TokensMoveDialogForm = ({
  cancel,
  colonyAddress,
  colonyTokens,
  colonyTokenRefs,
  handleSubmit,
  isSubmitting,
  isValid,
  setErrors,
  status,
  values,
}: Props & FormikProps<FormValues>) => {
  // Find the currently selected token
  const [selectedTokenRef, selectedToken] = useMemo(
    () => [
      colonyTokenRefs.find(token => token.address === values.tokenAddress),
      colonyTokens.find(token => token.address === values.tokenAddress),
    ],
    [colonyTokenRefs, colonyTokens, values.tokenAddress],
  );

  // Map the colony's tokens to Select options
  const tokenOptions = useMemo(
    () =>
      colonyTokenRefs.map(({ address }) => ({
        value: address,
        label:
          (
            colonyTokens.find(
              ({ address: refAddress }) => refAddress === address,
            ) || { symbol: undefined }
          ).symbol || '???',
      })),
    [colonyTokenRefs, colonyTokens],
  );

  // Fetch colony domains
  const { data: domains } = useDataFetcher<DomainType[]>(
    domainsFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  // Map the colony's domains to Select options
  const domainOptions = useMemo(
    () => [
      { value: 1, label: 'root' },
      ...(domains || []).map(({ id, name }) => ({ value: id, label: name })),
    ],
    [domains],
  );

  // Get from and to domain permissions for current user
  const currentUserAddress = useSelector(walletAddressSelector);
  const {
    data: fromDomainPermissions,
    isFetching: isFetchingFromDomainPermissions,
  } = useUserDomainRoles(
    colonyAddress,
    values.fromDomain || 1,
    currentUserAddress,
    true,
  );
  const {
    data: toDomainPermissions,
    isFetching: isFetchingToDomainPermissions,
  } = useUserDomainRoles(
    colonyAddress,
    values.toDomain || 1,
    currentUserAddress,
    true,
  );

  // Get domain token balances from state
  const fromDomainTokenBalanceSelector = useCallback(
    state =>
      tokenBalanceSelector(
        state,
        colonyAddress,
        values.tokenAddress || '',
        values.fromDomain || 1,
      ),
    [colonyAddress, values.fromDomain, values.tokenAddress],
  );
  const fromDomainTokenBalance = useMappedState(fromDomainTokenBalanceSelector);
  const toDomainTokenBalanceSelector = useCallback(
    state =>
      tokenBalanceSelector(
        state,
        colonyAddress,
        values.tokenAddress || '',
        values.toDomain || 1,
      ),
    [colonyAddress, values.toDomain, values.tokenAddress],
  );
  const toDomainTokenBalance = useMappedState(toDomainTokenBalanceSelector);

  // Perform form validations
  useEffect(() => {
    if (
      fromDomainTokenBalance &&
      fromDomainTokenBalance.lt(new BigNumber(values.amount))
    ) {
      setErrors({ amount: MSG.noBalance });
    }

    if (
      values.fromDomain &&
      !isFetchingFromDomainPermissions &&
      !fromDomainPermissions[COLONY_ROLE_FUNDING]
    ) {
      setErrors({ fromDomain: MSG.noPermissionFrom });
    }

    if (
      values.toDomain &&
      !isFetchingToDomainPermissions &&
      !toDomainPermissions[COLONY_ROLE_FUNDING]
    ) {
      setErrors({ toDomain: MSG.noPermissionTo });
    }

    if (
      values.toDomain !== undefined &&
      values.toDomain === values.fromDomain
    ) {
      setErrors({ toDomain: MSG.samePot });
    }
  }, [
    fromDomainPermissions,
    fromDomainTokenBalance,
    isFetchingFromDomainPermissions,
    isFetchingToDomainPermissions,
    selectedTokenRef,
    setErrors,
    toDomainPermissions,
    values.amount,
    values.fromDomain,
    values.toDomain,
  ]);

  return (
    <>
      <FormStatus status={status} />
      <DialogSection>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection>
        <Select options={domainOptions} label={MSG.from} name="fromDomain" />
        {values.fromDomain !== undefined && !!values.tokenAddress && (
          <div className={styles.domainPotBalance}>
            <FormattedMessage
              {...MSG.domainTokenAmount}
              values={{
                amount: (
                  <Numeral
                    appearance={{
                      size: 'small',
                      theme: 'grey',
                    }}
                    value={fromDomainTokenBalance || 0}
                    unit={(selectedToken && selectedToken.decimals) || 18}
                    truncate={3}
                  />
                ),
                symbol: selectedToken.symbol || '???',
              }}
            />
          </div>
        )}
      </DialogSection>
      <DialogSection>
        <Select options={domainOptions} label={MSG.to} name="toDomain" />
        {values.toDomain !== undefined && !!values.tokenAddress && (
          <div className={styles.domainPotBalance}>
            <FormattedMessage
              {...MSG.domainTokenAmount}
              values={{
                amount: (
                  <Numeral
                    appearance={{
                      size: 'small',
                      theme: 'grey',
                    }}
                    value={toDomainTokenBalance || 0}
                    unit={(selectedToken && selectedToken.decimals) || 18}
                    truncate={3}
                  />
                ),
                symbol: selectedToken.symbol || '???',
              }}
            />
          </div>
        )}
      </DialogSection>
      <DialogSection>
        <div className={styles.tokenAmount}>
          <div>
            <Input
              label={MSG.amount}
              name="amount"
              appearance={{ theme: 'minimal', align: 'right' }}
              formattingOptions={{
                delimiter: ',',
                numeral: true,
                numeralDecimalScale:
                  (selectedToken && selectedToken.decimals) || 18,
              }}
            />
          </div>
          <div className={styles.tokenAmountSelect}>
            <Select options={tokenOptions} name="tokenAddress" elementOnly />
          </div>
          {values.tokenAddress === ZERO_ADDRESS && (
            <div className={styles.tokenAmountUsd}>
              <EthUsd
                appearance={{ theme: 'grey', size: 'small' }}
                value={
                  values.amount && values.amount.length ? values.amount : 0
                }
              />
            </div>
          )}
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={cancel}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={handleSubmit}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid}
        />
      </DialogSection>
    </>
  );
};

TokensMoveDialogForm.displayName = 'admin.Tokens.TokensMoveDialogForm';

export default TokensMoveDialogForm;
