import React, { useMemo, useEffect } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import sortBy from 'lodash/sortBy';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { useTransformer } from '~utils/hooks';
import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, FormStatus, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';

import {
  useLoggedInUser,
  useTokenBalancesForDomainsLazyQuery,
  Colony,
} from '~data/index';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { getUserRolesForDomain } from '../../../transformers';
import { userHasRole } from '../../../users/checks';

import styles from './TransferFundsDialogForm.css';
import { FormValues } from './TransferFundsDialog';
import Icon from '~core/Icon';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.title',
    defaultMessage: 'Transfer Funds',
  },
  from: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.to',
    defaultMessage: 'To',
  },
  amount: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.amount',
    defaultMessage: 'Amount',
  },
  token: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.address',
    defaultMessage: 'Token',
  },
  annotation: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.annotation',
    defaultMessage: 'Explain why you’re transferring these funds (optional)',
  },
  domainTokenAmount: {
    id:
      'dashboard.TransferFundsDialog.TransferFundsDialogForm.domainTokenAmount',
    defaultMessage: 'Available: {amount} {symbol}',
  },
  noAmount: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.noAmount',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.noBalance',
    defaultMessage: 'Insufficient balance in from team pot',
  },
  noPermissionFrom: {
    id:
      'dashboard.TransferFundsDialog.TransferFundsDialogForm.noPermissionFrom',
    defaultMessage: `You need the {permissionLabel} permission in {domainName}
      to take this action`,
  },
  samePot: {
    id: 'dashboard.TransferFundsDialog.TransferFundsDialogForm.samePot',
    defaultMessage: 'Cannot move to same team pot',
  },
  transferIconTitle: {
    id:
      'dashboard.TransferFundsDialog.TransferFundsDialogForm.transferIconTitle',
    defaultMessage: 'Transfer',
  },
});

interface Props {
  back?: () => void;
  colony: Colony;
}

const TransferFundsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, domains, tokens },
  handleSubmit,
  isSubmitting,
  isValid,
  setErrors,
  status,
  values,
  validateForm,
  errors,
}: Props & FormikProps<FormValues>) => {
  const { tokenAddress, amount } = values;

  const fromDomainId = values.fromDomain
    ? parseInt(values.fromDomain, 10)
    : ROOT_DOMAIN_ID;
  const fromDomain = domains.find(
    ({ ethDomainId }) => ethDomainId === fromDomainId,
  );
  const toDomainId = values.toDomain
    ? parseInt(values.toDomain, 10)
    : undefined;

  const selectedToken = useMemo(
    () => tokens.find((token) => token.address === values.tokenAddress),
    [tokens, values.tokenAddress],
  );

  const tokenOptions = useMemo(
    () =>
      tokens.map(({ address, symbol }) => ({
        value: address,
        label: symbol || '???',
      })),
    [tokens],
  );

  const { walletAddress } = useLoggedInUser();

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    fromDomainId,
  ]);

  const userHasPermissions = userHasRole(fromDomainRoles, ColonyRole.Funding);

  const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map(({ name, ethDomainId }) => ({
          value: ethDomainId.toString(),
          label: name,
        })),
        ['value'],
      ),

    [domains],
  );

  const [
    loadTokenBalances,
    { data: tokenBalancesData },
  ] = useTokenBalancesForDomainsLazyQuery();

  useEffect(() => {
    if (tokenAddress) {
      loadTokenBalances({
        variables: {
          colonyAddress,
          tokenAddresses: [tokenAddress],
          domainIds: [fromDomainId, toDomainId || ROOT_DOMAIN_ID],
        },
      });
    }
  }, [
    colonyAddress,
    tokenAddress,
    fromDomainId,
    toDomainId,
    loadTokenBalances,
  ]);

  const fromDomainTokenBalance = useMemo(() => {
    const token =
      tokenBalancesData &&
      tokenBalancesData.tokens.find(({ address }) => address === tokenAddress);
    return getBalanceFromToken(token, fromDomainId);
  }, [fromDomainId, tokenAddress, tokenBalancesData]);

  const toDomainTokenBalance = useMemo(() => {
    if (toDomainId) {
      const token =
        tokenBalancesData &&
        tokenBalancesData.tokens.find(
          ({ address }) => address === tokenAddress,
        );
      return getBalanceFromToken(token, toDomainId);
    }
    return undefined;
  }, [toDomainId, tokenAddress, tokenBalancesData]);

  // Perform form validations
  useEffect(() => {
    const customValidationErrors: {
      amount?: any;
      toDomain?: any;
    } = {
      ...errors,
    };

    if (
      !selectedToken ||
      !(amount && amount.length) ||
      !fromDomainTokenBalance
    ) {
      return setErrors(customValidationErrors); // silent error
    }

    const convertedAmount = bigNumberify(
      moveDecimal(amount, getTokenDecimalsWithFallback(selectedToken.decimals)),
    );

    if (convertedAmount.isZero()) {
      customValidationErrors.amount = MSG.noAmount;
    }

    if (fromDomainTokenBalance.lt(convertedAmount)) {
      customValidationErrors.amount = MSG.noBalance;
    }

    if (toDomainId !== undefined && toDomainId === fromDomainId) {
      customValidationErrors.toDomain = MSG.samePot;
    }

    return setErrors(customValidationErrors);
  }, [
    errors,
    amount,
    fromDomainId,
    fromDomainTokenBalance,
    selectedToken,
    setErrors,
    toDomainId,
  ]);

  return (
    <>
      <FormStatus status={status} />
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!userHasPermissions && (
        <div className={styles.permissionsRequired}>
          <DialogSection>
            <PermissionRequiredInfo requiredRoles={requiredRoles} />
          </DialogSection>
        </div>
      )}
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.from}
              name="fromDomain"
              appearance={{ theme: 'grey' }}
              onChange={() => validateForm()}
              disabled={!userHasPermissions}
            />
            {!!tokenAddress && (
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
                        unit={getTokenDecimalsWithFallback(
                          selectedToken && selectedToken.decimals,
                        )}
                        truncate={3}
                      />
                    ),
                    symbol: (selectedToken && selectedToken.symbol) || '???',
                  }}
                />
              </div>
            )}
          </div>
          <Icon
            className={styles.transferIcon}
            name="circle-arrow-back"
            title={MSG.transferIconTitle}
            appearance={{ size: 'medium' }}
          />
          <div>
            <Select
              options={domainOptions}
              label={MSG.to}
              name="toDomain"
              appearance={{ theme: 'grey' }}
              onChange={() => validateForm()}
              disabled={!userHasPermissions}
            />
            {!!tokenAddress && toDomainTokenBalance && !errors.toDomain && (
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
                        unit={getTokenDecimalsWithFallback(
                          selectedToken && selectedToken.decimals,
                        )}
                        truncate={3}
                      />
                    ),
                    symbol: (selectedToken && selectedToken.symbol) || '???',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.tokenAmount}>
          <div>
            <Input
              label={MSG.amount}
              name="amount"
              appearance={{
                theme: 'minimal',
                align: 'right',
              }}
              formattingOptions={{
                delimiter: ',',
                numeral: true,
                numeralDecimalScale: getTokenDecimalsWithFallback(
                  selectedToken && selectedToken.decimals,
                ),
              }}
              disabled={!userHasPermissions}
              onChange={() => validateForm()}
            />
          </div>
          <div className={styles.tokenAmountSelect}>
            <Select
              label={MSG.token}
              options={tokenOptions}
              name="tokenAddress"
              elementOnly
              appearance={{ alignOptions: 'right', theme: 'grey' }}
              disabled={!userHasPermissions}
            />
          </div>
          {values.tokenAddress === AddressZero && (
            <div className={styles.tokenAmountUsd}>
              <EthUsd
                appearance={{ theme: 'grey', size: 'small' }}
                value={
                  /*
                   * @NOTE Set value to 0 if amount is only the decimal point
                   * Just entering the decimal point will pass it through to EthUsd
                   * and that will try to fetch the balance for, which, obviously, will fail
                   */
                  values.amount && values.amount !== '.' ? values.amount : '0'
                }
              />
            </div>
          )}
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={!userHasPermissions}
        />
      </DialogSection>
      {!userHasPermissions && (
        <DialogSection>
          <span className={styles.permissionsError}>
            <FormattedMessage
              {...MSG.noPermissionFrom}
              values={{
                permissionLabel: (
                  <PermissionsLabel
                    permission={ColonyRole.Funding}
                    name={{ id: `role.${ColonyRole.Funding}` }}
                  />
                ),
                domainName: fromDomain?.name,
              }}
            />
          </span>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        {back && (
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={back}
            text={{ id: 'button.back' }}
          />
        )}
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid || !userHasPermissions}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName =
  'dashboard.TransferFundsDialog.TransferFundsDialogForm';

export default TransferFundsDialogForm;
