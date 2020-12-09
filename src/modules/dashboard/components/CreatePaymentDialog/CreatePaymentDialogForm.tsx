import React, { useMemo, useEffect } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import sortBy from 'lodash/sortBy';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { Address } from '~types/index';
import { useTransformer } from '~utils/hooks';
import PermissionsLabel from '~core/PermissionsLabel';
import Button from '~core/Button';
import { ItemDataType } from '~core/OmniPicker';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations } from '~core/Fields';
import Heading from '~core/Heading';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  useLoggedInUser,
  useTokenBalancesForDomainsLazyQuery,
  Colony,
  AnyUser,
} from '~data/index';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { getUserRolesForDomain } from '../../../transformers';
import { userHasRole } from '../../../users/checks';

import { FormValues } from './CreatePaymentDialog';

import styles from './CreatePaymentDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.title',
    defaultMessage: 'Payment',
  },
  from: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.to',
    defaultMessage: 'Assignee',
  },
  amount: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.amount',
    defaultMessage: 'Amount',
  },
  token: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.address',
    defaultMessage: 'Token',
  },
  annotation: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.annotation',
    defaultMessage: 'Explain why you’re making this payment (optional)',
  },
  domainTokenAmount: {
    id:
      'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.domainTokenAmount',
    defaultMessage: 'Available Funds: {amount} {symbol}',
  },
  noAmount: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.noAmount',
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.noBalance',
    defaultMessage: 'Insufficient balance in from domain pot',
  },
  noPermissionFrom: {
    id:
      'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.noPermissionFrom',
    defaultMessage:
      // eslint-disable-next-line max-len
      'You do not have the {firstRoleRequired} and {secondRoleRequired} permissions required to take this action.',
  },
});

interface Props {
  back: () => void;
  colony: Colony;
  subscribedUsers: AnyUser[];
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const CreatePaymentDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, domains, tokens },
  subscribedUsers,
  handleSubmit,
  isSubmitting,
  isValid,
  setErrors,
  values,
}: Props & FormikProps<FormValues>) => {
  const { tokenAddress, amount } = values;
  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : ROOT_DOMAIN_ID;

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
    domainId,
  ]);

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
          domainIds: [domainId],
        },
      });
    }
  }, [colonyAddress, tokenAddress, domainId, loadTokenBalances]);

  const fromDomainTokenBalance = useMemo(() => {
    const token =
      tokenBalancesData &&
      tokenBalancesData.tokens.find(({ address }) => address === tokenAddress);
    return token && getBalanceFromToken(token, domainId);
  }, [domainId, tokenAddress, tokenBalancesData]);

  useEffect(() => {
    const errors: {
      amount?: any;
    } = {};

    if (!selectedToken || !amount) {
      errors.amount = undefined; // silent error
    } else {
      const convertedAmount = bigNumberify(
        moveDecimal(
          amount,
          getTokenDecimalsWithFallback(selectedToken.decimals),
        ),
      );
      if (
        fromDomainTokenBalance &&
        fromDomainTokenBalance.lt(convertedAmount)
      ) {
        errors.amount = MSG.noBalance;
      }
    }

    setErrors(errors);
  }, [
    amount,
    domainId,
    fromDomainRoles,
    fromDomainTokenBalance,
    selectedToken,
    setErrors,
  ]);

  const userHasFundingPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Funding,
  );
  const userHasAdministrationPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Administration,
  );
  const userHasPermission =
    userHasFundingPermission && userHasAdministrationPermission;
  const requiredRoles: ColonyRole[] = [
    ColonyRole.Funding,
    ColonyRole.Administration,
  ];

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.from}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              disabled={!userHasPermission}
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
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={subscribedUsers}
            label={MSG.to}
            name="recipient"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            disabled={!userHasPermission}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.tokenAmount}>
          <div className={styles.tokenAmountInputContainer}>
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
              disabled={!userHasPermission}
            />
          </div>
          <div className={styles.tokenAmountSelect}>
            <Select
              label={MSG.token}
              options={tokenOptions}
              name="tokenAddress"
              elementOnly
              appearance={{ alignOptions: 'right', theme: 'grey' }}
              disabled={!userHasPermission}
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
          disabled={!userHasPermission}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <span className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermissionFrom}
              values={{
                firstRoleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Funding}
                    name={{ id: `role.${ColonyRole.Funding}` }}
                  />
                ),
                secondRoleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Administration}
                    name={{ id: `role.${ColonyRole.Administration}` }}
                  />
                ),
              }}
            />
          </span>
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        {/**
         * @TODO: Add validation for when colony doesn't have the OneTxPayment extension enabled
         */}
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

CreatePaymentDialogForm.displayName =
  'dashboard.CreatePaymentDialog.CreatePaymentDialogForm';

export default CreatePaymentDialogForm;
