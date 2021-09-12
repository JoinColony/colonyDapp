import React, { useMemo, useCallback, useEffect, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { FormattedMessage, defineMessages } from 'react-intl';
import sortBy from 'lodash/sortBy';
import { AddressZero } from 'ethers/constants';
import { ROOT_DOMAIN_ID, ColonyRole } from '@colony/colony-js';

import Button from '~core/Button';
import { ItemDataType } from '~core/OmniPicker';
import { ActionDialogProps } from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Select, Input, Annotations, SelectOption } from '~core/Fields';
import Heading from '~core/Heading';
import { calculatePercentageReputation } from '~core/MemberReputation';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import Toggle from '~core/Fields/Toggle';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import PermissionsLabel from '~core/PermissionsLabel';

import { Address } from '~types/index';
import HookedUserAvatar from '~users/HookedUserAvatar';
import {
  AnyUser,
  OneDomain,
  useUserReputationQuery,
  useLoggedInUser,
} from '~data/index';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import { useTransformer } from '~utils/hooks';

import { getUserRolesForDomain } from '../../../transformers';
import { userHasRole } from '../../../users/checks';

import { FormValues } from './SmiteDialog';
import TeamDropdownItem from './TeamDropdownItem';

import styles from './SmiteDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.title',
    defaultMessage: 'Smite',
  },
  team: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.team',
    defaultMessage: 'Select Team in which punishment should happen',
  },
  who: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.who',
    defaultMessage: 'Pick who is the target',
  },
  amount: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.amount',
    defaultMessage: 'Amount of reputation to deduct',
  },
  annotation: {
    id: 'dashboard.SmiteDialog.SmiteDialogForm.annotation',
    defaultMessage: 'Explain why you are smiting the user (optional)',
  },
  userPickerPlaceholder: {
    id: 'SmiteDialog.SmiteDialogForm.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
  noPermission: {
    id: `dashboard.SmiteDialog.SmiteDialogForm.noPermission`,
    defaultMessage: `You need the {roleRequired} permission in {domain} to take this action.`,
  },
});
interface Props extends ActionDialogProps {
  subscribedUsers: AnyUser[];
  ethDomainId?: number;
  updateReputation: (data?: string) => void;
  isVotingExtensionEnabled: boolean;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: Address, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const DECIMAL_PLACES = 2;

const SmiteDialogForm = ({
  back,
  colony: { domains, colonyAddress },
  colony,
  subscribedUsers,
  handleSubmit,
  setFieldValue,
  isSubmitting,
  isValid,
  values,
  updateReputation,
  ethDomainId: preselectedDomainId,
  isVotingExtensionEnabled,
}: Props & FormikProps<FormValues>) => {
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
    hasRegisteredProfile && userHasRole(domainRoles, ColonyRole.Arbitration);

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
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
    DECIMAL_PLACES,
    userReputationData,
    totalReputationData,
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
      const domain = colony.domains.find(
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
    [values, colonyAddress, colony.domains],
  );

  useEffect(() => {
    updateReputation(totalReputationData?.userReputation);
  }, [totalReputationData, updateReputation]);

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
            />
            {hasRoles && isVotingExtensionEnabled && (
              <Toggle
                label={{ id: 'label.force' }}
                name="forceAction"
                disabled={!userHasPermission}
              />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Arbitration]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={subscribedUsers}
            label={MSG.who}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder={MSG.userPickerPlaceholder}
            disabled={inputDisabled}
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.team}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              renderActiveOption={renderActiveOption}
              disabled={inputDisabled}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.inputContainer}>
          <Input
            name="amount"
            label={MSG.amount}
            appearance={{
              theme: 'minimal',
              align: 'right',
            }}
            formattingOptions={{
              numeral: true,
              // @ts-ignore
              tailPrefix: true,
            }}
            elementOnly
            maxButtonParams={{
              fieldName: 'amount',
              maxAmount: userPercentageReputation || 0,
              setFieldValue,
            }}
            disabled={inputDisabled}
          />
          <div className={styles.percentageSign}>%</div>
          <p
            className={styles.inputText}
          >{`max: ${userPercentageReputation}%`}</p>
        </div>
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
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
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => handleSubmit()}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid || inputDisabled}
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

SmiteDialogForm.displayName = 'dashboard.SmiteDialog.SmiteDialogForm';

export default SmiteDialogForm;
