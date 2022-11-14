import React, { useMemo, useCallback, useEffect, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { AddressZero } from 'ethers/constants';
import {
  ROOT_DOMAIN_ID,
  ColonyRole,
  VotingReputationExtensionVersion,
} from '@colony/colony-js';
import Decimal from 'decimal.js';

import Button from '~core/Button';
import { ItemDataType } from '~core/OmniPicker';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import {
  Select,
  Input,
  Annotations,
  SelectOption,
  ForceToggle,
} from '~core/Fields';
import Heading from '~core/Heading';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import PermissionsLabel from '~core/PermissionsLabel';
import Numeral from '~core/Numeral';
import ExternalLink from '~core/ExternalLink';
import { REPUTATION_LEARN_MORE } from '~externalUrls';

import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  AnyUser,
  OneDomain,
  useUserReputationQuery,
  useLoggedInUser,
} from '~data/index';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { useTransformer } from '~utils/hooks';
import { getFormattedTokenValue } from '~utils/tokens';
import { calculatePercentageReputation } from '~utils/reputation';

import { getUserRolesForDomain } from '~modules/transformers';
import { userHasRole } from '~modules/users/checks';

import { ManageReputationDialogFormValues } from '../types';
import TeamDropdownItem from './TeamDropdownItem';

import styles from './ManageReputationDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ManageReputationContainer.ManageReputationDialogForm.title',
    defaultMessage: `{isSmiteAction, select,
      true {Smite Reputation}
      false {Award Reputation}
    }`,
  },
  team: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.team`,
    defaultMessage: `Team in which Reputation should be {isSmiteAction, select,
      true {deducted}
      false {awarded}
    }`,
  },
  recipient: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.recipient`,
    defaultMessage: 'Recipient',
  },
  amount: {
    id: 'dashboard.ManageReputationContainer.ManageReputationDialogForm.amount',
    defaultMessage: `Amount of reputation points to {isSmiteAction, select,
      true {deduct}
      false {award}
    }`,
  },
  annotation: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.annotation`,
    defaultMessage: `Explain why you're {isSmiteAction, select,
      true {smiting}
      false {awarding}
    } the user (optional)`,
  },
  userPickerPlaceholder: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  noPermission: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.noPermission`,
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
  maxReputation: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.maxReputation`,
    defaultMessage: `{isSmiteAction, select,
      true {max: }
      false {}
    }{userReputationAmount} {userReputationAmount, plural,
      one {pt}
      other {pts}
    } ({userPercentageReputation}%)`,
  },
  warningTitle: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.warningTitle`,
    defaultMessage: `Caution!`,
  },
  warningText: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.noPermission`,
    defaultMessage: `Improper use of this feature can break your colony. <a>Learn more</a>`,
  },
  cannotCreateMotion: {
    id: `dashboard.ManageReputationContainer.ManageReputationDialogForm.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  nativeTokenDecimals: number;
  verifiedUsers: AnyUser[];
  ethDomainId?: number;
  updateReputation?: (
    userPercentageReputation: number,
    totalRep?: string,
  ) => void;
  isSmiteAction?: boolean;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const ManageReputationDialogForm = ({
  back,
  colony: { domains, colonyAddress },
  colony,
  handleSubmit,
  setFieldValue,
  isSubmitting,
  isValid,
  values,
  updateReputation,
  ethDomainId: preselectedDomainId,
  nativeTokenDecimals,
  verifiedUsers,
  isSmiteAction = false,
}: Props & FormikProps<ManageReputationDialogFormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const hasRegisteredProfile = !!username && !ethereal;

  const selectedDomain =
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? ROOT_DOMAIN_ID
      : preselectedDomainId;

  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : selectedDomain;

  const domainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    domainId,
  ]);

  const hasRoles =
    hasRegisteredProfile &&
    userHasRole(
      domainRoles,
      isSmiteAction ? ColonyRole.Arbitration : ColonyRole.Root,
    );

  const {
    votingExtensionVersion,
    isVotingExtensionEnabled,
  } = useEnabledExtensions({
    colonyAddress,
  });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colonyAddress,
    hasRoles,
    isVotingExtensionEnabled,
    values.forceAction,
    domainId,
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  const { data: userReputationData } = useUserReputationQuery({
    variables: {
      address: values.user?.profile.walletAddress,
      colonyAddress,
      domainId: Number(values.domainId),
    },
    fetchPolicy: 'network-only',
  });

  const { data: totalReputationData } = useUserReputationQuery({
    variables: {
      address: AddressZero,
      colonyAddress,
      domainId: Number(values.domainId),
    },
    fetchPolicy: 'network-only',
  });

  const userPercentageReputation = calculatePercentageReputation(
    userReputationData?.userReputation,
    totalReputationData?.userReputation,
  );
  const unformattedUserReputationAmount = new Decimal(
    userReputationData?.userReputation || 0,
  )
    .div(new Decimal(10).pow(nativeTokenDecimals))
    .toNumber();
  const formattedUserReputationAmount = getFormattedTokenValue(
    userReputationData?.userReputation || 0,
    nativeTokenDecimals,
  );

  const domainOptions = useMemo(
    () =>
      sortBy(
        domains.map((domain) => ({
          children: (
            <TeamDropdownItem
              domain={domain as OneDomain}
              colonyAddress={colonyAddress}
              user={(values.user as any) as AnyUser}
            />
          ),
          value: domain.ethDomainId.toString(),
          label: domain.name,
        })),
        ['value'],
      ),

    [domains, values, colonyAddress],
  );

  const domainName = useMemo(
    () =>
      domains.filter((domain) => domain.id === domainId.toString())[0]?.name,
    [domains, domainId],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined) => ReactNode
  >(
    (option) => {
      const value = option ? option.value : undefined;
      const domain = domains.find(
        ({ ethDomainId }) => Number(value) === ethDomainId,
      ) as OneDomain;
      return (
        <div className={styles.activeItem}>
          <TeamDropdownItem
            domain={domain}
            colonyAddress={colonyAddress}
            user={(values.user as any) as AnyUser}
          />
        </div>
      );
    },
    [values, colonyAddress, domains],
  );

  useEffect(() => {
    if (updateReputation) {
      updateReputation(
        unformattedUserReputationAmount,
        totalReputationData?.userReputation,
      );
    }
  }, [totalReputationData, updateReputation, unformattedUserReputationAmount]);

  const handleFilterMotionDomains = useCallback(
    (optionDomain) => {
      const optionDomainId = parseInt(optionDomain.value, 10);
      if (domainId === ROOT_DOMAIN_ID) {
        return optionDomainId === ROOT_DOMAIN_ID;
      }
      return optionDomainId === domainId || optionDomainId === ROOT_DOMAIN_ID;
    },
    [domainId],
  );

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
    [setFieldValue],
  );

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
                onDomainChange={handleMotionDomainChange}
                disabled={values.forceAction}
                /*
                 * @NOTE We can only create a motion to vote in a subdomain if we
                 * change reputation in that subdomain
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
              textValues={{
                isSmiteAction,
              }}
            />
            {hasRoles && isVotingExtensionEnabled && (
              <ForceToggle disabled={!userHasPermission || isSubmitting} />
            )}
          </div>
          {!isSmiteAction && (
            <div className={styles.warningContainer}>
              <p className={styles.warningTitle}>
                <FormattedMessage {...MSG.warningTitle} />
              </p>
              <p className={styles.warningText}>
                <FormattedMessage
                  {...MSG.warningText}
                  values={{
                    a: (chunks) => (
                      <ExternalLink href={REPUTATION_LEARN_MORE}>
                        {chunks}
                      </ExternalLink>
                    ),
                  }}
                />
              </p>
            </div>
          )}
        </div>
      </DialogSection>
      {!isSmiteAction && <hr className={styles.divider} />}
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Arbitration]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={verifiedUsers}
            label={MSG.recipient}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder={MSG.userPickerPlaceholder}
            disabled={inputDisabled}
            dataTest="reputationRecipientSelector"
            itemDataTest="reputationRecipientSelectorItem"
            valueDataTest="reputationRecipientName"
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.team}
              labelValues={{
                isSmiteAction,
              }}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              renderActiveOption={renderActiveOption}
              disabled={!userHasPermission}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.inputContainer}>
          <div>
            <Input
              name="amount"
              label={MSG.amount}
              labelValues={{ isSmiteAction }}
              appearance={{
                theme: 'minimal',
                align: 'right',
              }}
              formattingOptions={{
                numeral: true,
                // @ts-ignore
                tailPrefix: true,
                numeralDecimalScale: 10,
              }}
              elementOnly
              maxButtonParams={
                isSmiteAction
                  ? {
                      fieldName: 'amount',
                      maxAmount: String(unformattedUserReputationAmount),
                      setFieldValue,
                    }
                  : undefined
              }
              disabled={inputDisabled}
              dataTest="reputationAmountInput"
            />
            <div className={styles.percentageSign}>pts</div>
          </div>
          <p className={styles.inputText}>
            <FormattedMessage
              {...MSG.maxReputation}
              values={{
                isSmiteAction,
                userReputationAmount: (
                  <Numeral value={formattedUserReputationAmount} />
                ),
                userPercentageReputation:
                  userPercentageReputation === null
                    ? 0
                    : userPercentageReputation,
              }}
            />
          </p>
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          labelValues={{
            isSmiteAction,
          }}
          name="annotation"
          disabled={inputDisabled}
          dataTest="reputationAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermission}
              values={{
                roleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Architecture}
                    name={{ id: `role.${ColonyRole.Architecture}` }}
                  />
                ),
                domain: domainName,
              }}
            />
          </div>
        </DialogSection>
      )}
      {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={Number(domainId)}
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
          disabled={cannotCreateMotion || !isValid || inputDisabled}
          style={{ minWidth: styles.wideButton }}
          data-test="reputationConfirmButton"
        />
      </DialogSection>
    </>
  );
};

ManageReputationDialogForm.displayName =
  'dashboard.ManageReputationContainer.ManageReputationDialogForm';

export default ManageReputationDialogForm;
