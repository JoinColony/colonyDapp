import React, { useMemo, useEffect } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import {
  ColonyRole,
  ROOT_DOMAIN_ID,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { useTransformer } from '~utils/hooks';
import Button from '~core/Button';
import DialogSection from '~core/Dialog/DialogSection';
import {
  Select,
  Input,
  Annotations,
  TokenSymbolSelector,
  SelectOption,
} from '~core/Fields';
import Heading from '~core/Heading';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import PermissionsLabel from '~core/PermissionsLabel';
import {
  useLoggedInUser,
  useTokenBalancesForDomainsLazyQuery,
} from '~data/index';
import { ActionDialogProps } from '~core/Dialog';
import EthUsd from '~core/EthUsd';
import Numeral from '~core/Numeral';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';

import styles from './TransferFundsDialogForm.css';
import { FormValues } from './TransferFundsDialog';
import Icon from '~core/Icon';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

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
  cannotCreateMotion: {
    id: `dashboard.TransferFundsDialog.TransferFundsDialogForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props {
  domainOptions: SelectOption[];
}

const TransferFundsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, domains, tokens },
  domainOptions,
  handleSubmit,
  isSubmitting,
  isValid,
  setErrors,
  values,
  validateForm,
  errors,
}: ActionDialogProps & FormikProps<FormValues> & Props) => {
  const { tokenAddress, amount } = values;

  const {
    isVotingExtensionEnabled,
    votingExtensionVersion,
  } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const fromDomainId = values.fromDomain
    ? parseInt(values.fromDomain, 10)
    : ROOT_DOMAIN_ID;
  const fromDomain = domains.find(
    ({ ethDomainId }) => ethDomainId === fromDomainId,
  );
  const toDomainId = values.toDomain
    ? parseInt(values.toDomain, 10)
    : undefined;
  const toDomain = domains.find(
    ({ ethDomainId }) => ethDomainId === toDomainId,
  );
  const selectedToken = useMemo(
    () => tokens.find((token) => token.address === values.tokenAddress),
    [tokens, values.tokenAddress],
  );

  const { walletAddress } = useLoggedInUser();

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    fromDomainId,
  ]);

  const toDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    toDomainId,
  ]);
  const hasRoleInFromDomain = userHasRole(fromDomainRoles, ColonyRole.Funding);
  const hasRoleInToDomain = userHasRole(toDomainRoles, ColonyRole.Funding);
  const canTransferFunds = hasRoleInFromDomain && hasRoleInToDomain;

  const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canTransferFunds,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

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

  const cannotCreateMotion =
    votingExtensionVersion ===
      VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
    !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                /*
                 * @NOTE Always disabled since you can only create this motion in root
                 */
                disabled
              />
            </div>
          )}
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {canTransferFunds && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
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
              disabled={onlyForceAction || isSubmitting}
              dataTest="domainIdSelector"
              itemDataTest="domainIdItem"
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
              disabled={onlyForceAction || isSubmitting}
              dataTest="domainIdSelector"
              itemDataTest="domainIdItem"
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
          <div className={styles.amountContainer}>
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
              disabled={inputDisabled}
              onChange={() => validateForm()}
              dataTest="transferAmountInput"
            />
          </div>
          <div className={styles.tokenAmountContainer}>
            <div className={styles.tokenAmountSelect}>
              <TokenSymbolSelector
                label={MSG.token}
                tokens={tokens}
                name="tokenAddress"
                elementOnly
                appearance={{ alignOptions: 'right', theme: 'grey' }}
                disabled={inputDisabled}
              />
            </div>
            {values.tokenAddress === AddressZero && (
              <div className={styles.tokenAmountUsd}>
                <EthUsd
                  appearance={{ theme: 'grey' }}
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
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
          dataTest="transferFundsAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
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
                domainName:
                  (!hasRoleInFromDomain && fromDomain?.name) ||
                  (!hasRoleInToDomain && toDomain?.name),
              }}
            />
          </span>
        </DialogSection>
      )}
      {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.cannotCreateMotion}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
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
          text={
            values.forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          disabled={cannotCreateMotion || !isValid || inputDisabled}
          style={{ minWidth: styles.wideButton }}
          data-test="transferFundsConfirmButton"
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName =
  'dashboard.TransferFundsDialog.TransferFundsDialogForm';

export default TransferFundsDialogForm;
