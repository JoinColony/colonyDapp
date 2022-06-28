import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { FormikProps } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import sortBy from 'lodash/sortBy';
import {
  ColonyRole,
  ROOT_DOMAIN_ID,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
import { isConfusing } from '@colony/unicode-confusables-noascii';

import Numeral from '~core/Numeral';
import PermissionsLabel from '~core/PermissionsLabel';
import Button from '~core/Button';
import ConfusableWarning from '~core/ConfusableWarning';
import { ItemDataType } from '~core/OmniPicker';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Annotations, AmountTokens } from '~core/Fields';
import { calculateFee } from '~core/Fields/AmountTokens';
import Heading from '~core/Heading';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import ForceToggle from '~core/Fields/ForceToggle';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  useLoggedInUser,
  useTokenBalancesForDomainsLazyQuery,
  AnyUser,
  useNetworkContracts,
} from '~data/index';
import {
  getBalanceFromToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useTransformer } from '~utils/hooks';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';

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
  fee: {
    id: 'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.fee',
    defaultMessage: 'Network fee: {fee} {symbol}',
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
    defaultMessage: `You do not have the {firstRoleRequired} and
    {secondRoleRequired} permissions required to take this action.`,
  },
  noOneTxExtension: {
    id:
      'dashboard.CreatePaymentDialog.CreatePaymentDialogForm.noOneTxExtension',
    defaultMessage: `The OneTxPayment extension is not installed in this colony.
    Please use the Extensions Manager to install it if you want to make a new
    payment.`,
  },
  userPickerPlaceholder: {
    id: `dashboard.CreatePaymentDialog.CreatePaymentDialogForm.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  warningText: {
    id: `dashboard.CreatePaymentDialog.CreatePaymentDialogForm.warningText`,
    defaultMessage: `<span>Warning.</span> You are about to make a payment to an address not on the whitelist. Are you sure the address is correct?`,
  },
  cannotCreateMotion: {
    id: `dashboard.CreatePaymentDialog.CreatePaymentDialogForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});
interface Props extends ActionDialogProps {
  verifiedUsers: AnyUser[];
  showWhitelistWarning: boolean;
  ethDomainId?: number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const CreatePaymentDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, domains, tokens },
  verifiedUsers,
  handleSubmit,
  setFieldValue,
  isSubmitting,
  isValid,
  values,
  ethDomainId: preselectedDomainId,
  showWhitelistWarning,
}: Props & FormikProps<FormValues>) => {
  const selectedDomain =
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? ROOT_DOMAIN_ID
      : preselectedDomainId;

  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : selectedDomain;
  /*
   * Custom error state tracking
   */
  const [customAmountError, setCustomAmountError] = useState<
    MessageDescriptor | string | undefined
  >(undefined);
  const [currentFromDomain, setCurrentFromDomain] = useState<number>(domainId);
  const { tokenAddress, amount } = values;

  const selectedToken = useMemo(
    () => tokens.find((token) => token.address === values.tokenAddress),
    [tokens, values.tokenAddress],
  );

  const {
    isOneTxPaymentExtensionEnabled,
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress,
  });

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
    if (token) {
      /*
       * Reset our custom error state, since we changed the domain
       */
      setCustomAmountError(undefined);
      return getBalanceFromToken(token, domainId);
    }
    return null;
  }, [domainId, tokenAddress, tokenBalancesData]);

  const { feeInverse: networkFeeInverse } = useNetworkContracts();
  useEffect(() => {
    if (selectedToken && amount) {
      const decimals = getTokenDecimalsWithFallback(
        selectedToken && selectedToken.decimals,
      );
      const convertedAmount = bigNumberify(
        moveDecimal(
          networkFeeInverse
            ? calculateFee(amount, networkFeeInverse, decimals).totalToPay
            : amount,
          decimals,
        ),
      );

      if (
        fromDomainTokenBalance &&
        (fromDomainTokenBalance.lt(convertedAmount) ||
          fromDomainTokenBalance.isZero())
      ) {
        /*
         * @NOTE On custom, parallel, in-component error handling
         *
         * We need to keep track of a separate error state, since we are doing
         * custom validation (checking if a domain has enough funds), alongside
         * using a validationSchema.
         *
         * This makes it so that even if we manual set the error, it will get
         * overwritten instantly when the next Formik State update triggers, making
         * it basically impossible for us to manually put the Form into an error
         * state.
         *
         * See: https://github.com/formium/formik/issues/706
         *
         * Because of this, we keep our own error state that runs in parallel
         * to Formik's error state.
         */
        setCustomAmountError(MSG.noBalance);
      } else {
        setCustomAmountError(undefined);
      }
    }
  }, [
    amount,
    domainId,
    fromDomainRoles,
    fromDomainTokenBalance,
    selectedToken,
    setCustomAmountError,
    networkFeeInverse,
  ]);

  const userHasFundingPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Funding,
  );
  const userHasAdministrationPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Administration,
  );
  const hasRoles = userHasFundingPermission && userHasAdministrationPermission;
  const requiredRoles: ColonyRole[] = [
    ColonyRole.Funding,
    ColonyRole.Administration,
  ];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    hasRoles,
    isVotingExtensionEnabled,
    values.forceAction,
    domainId,
  );

  const cannotCreateMotion =
    votingExtensionVersion ===
      VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
    !values.forceAction;

  const handleFromDomainChange = useCallback(
    (fromDomainValue) => {
      const fromDomainId = parseInt(fromDomainValue, 10);
      const selectedMotionDomainId = parseInt(values.motionDomainId, 10);
      if (
        fromDomainId !== ROOT_DOMAIN_ID &&
        fromDomainId !== currentFromDomain
      ) {
        setCurrentFromDomain(fromDomainId);
      } else {
        setCurrentFromDomain(ROOT_DOMAIN_ID);
      }
      if (selectedMotionDomainId !== fromDomainId) {
        setFieldValue('motionDomainId', fromDomainId);
      }
    },
    [currentFromDomain, setFieldValue, values.motionDomainId],
  );

  const handleFilterMotionDomains = useCallback(
    (optionDomain) => {
      const optionDomainId = parseInt(optionDomain.value, 10);
      if (currentFromDomain === ROOT_DOMAIN_ID) {
        return optionDomainId === ROOT_DOMAIN_ID;
      }
      return (
        optionDomainId === currentFromDomain ||
        optionDomainId === ROOT_DOMAIN_ID
      );
    },
    [currentFromDomain],
  );

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
    [setFieldValue],
  );

  const canMakePayment = userHasPermission && isOneTxPaymentExtensionEnabled;

  const inputDisabled = !canMakePayment || onlyForceAction || isSubmitting;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                onDomainChange={handleMotionDomainChange}
                disabled={values.forceAction || isSubmitting}
                /*
                 * @NOTE We can only create a motion to vote in a subdomain if we
                 * create a payment from that subdomain
                 */
                filterDomains={handleFilterMotionDomains}
                initialSelectedDomain={domainId}
              />
            </div>
          )}
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {hasRoles && isVotingExtensionEnabled && (
              <ForceToggle disabled={!canMakePayment || isSubmitting} />
            )}
          </div>
        </div>
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
              onChange={handleFromDomainChange}
              disabled={isSubmitting}
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
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={verifiedUsers}
            label={MSG.to}
            name="recipient"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            disabled={inputDisabled}
            placeholder={MSG.userPickerPlaceholder}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
            valueDataTest="paymentRecipientName"
          />
        </div>
        {showWhitelistWarning && (
          <div className={styles.warningContainer}>
            <p className={styles.warningText}>
              <FormattedMessage
                {...MSG.warningText}
                values={{
                  span: (chunks) => (
                    <span className={styles.warningLabel}>{chunks}</span>
                  ),
                }}
              />
            </p>
          </div>
        )}
        {values.recipient &&
          isConfusing(
            values.recipient.profile.username ||
              values.recipient.profile.displayName,
          ) && (
            <ConfusableWarning
              walletAddress={values.recipient.profile.walletAddress}
              colonyAddress={colonyAddress}
            />
          )}
      </DialogSection>
      <DialogSection>
        <AmountTokens
          values={values}
          networkFeeInverse={networkFeeInverse}
          customAmountError={customAmountError}
          selectedToken={selectedToken}
          tokens={tokens}
          disabledInput={inputDisabled}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
          dataTest="paymentAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
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
          </div>
        </DialogSection>
      )}
      {userHasPermission && !isOneTxPaymentExtensionEnabled && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage {...MSG.noOneTxExtension} />
          </div>
        </DialogSection>
      )}
      {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={domainId}
        />
      )}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
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
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={
            values.forceAction || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          /*
           * Disable Form submissions if either the form is invalid, or
           * if our custom state was triggered.
           */
          disabled={
            cannotCreateMotion ||
            !isValid ||
            !!customAmountError ||
            inputDisabled
          }
          style={{ minWidth: styles.wideButton }}
          data-test="paymentConfirmButton"
        />
      </DialogSection>
    </>
  );
};

CreatePaymentDialogForm.displayName =
  'dashboard.CreatePaymentDialog.CreatePaymentDialogForm';

export default CreatePaymentDialogForm;
