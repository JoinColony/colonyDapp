import React, { useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';
import { FormikProps } from 'formik';

import { InputLabel, Select, Annotations } from '~core/Fields';
import { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import Toggle from '~core/Fields/Toggle';
import { ItemDataType } from '~core/OmniPicker';

import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { Address } from '~types/index';
import { useMembersSubscription, AnyUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRolesForDomain } from '../../../transformers';
import { availableRoles } from './constants';

import { FormValues } from './PermissionManagementDialog';
import PermissionManagementCheckbox from './PermissionManagementCheckbox';

import styles from './PermissionManagementDialog.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.PermissionManagementDialog.PermissionManagementForm.title',
    defaultMessage: 'Permissions',
  },
  domain: {
    id: 'dashboard.PermissionManagementDialog.PermissionManagementForm.domain',
    defaultMessage: 'Team',
  },
  permissionsLabel: {
    id: `dashboard
      .PermissionManagementDialog.PermissionManagementForm.permissionsLabel`,
    defaultMessage: 'Permissions',
  },
  annotation: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementForm.annotation`,
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
  selectUser: {
    id: `dashboard.PermissionManagementDialog.PermissionManagementForm.selectUser`,
    defaultMessage: 'Member',
  },
  userPickerPlaceholder: {
    id: 'SingleUserPicker.userPickerPlaceholder',
    defaultMessage: 'Search for a user or paste wallet address',
  },
});

interface Props {
  colony: Colony;
  currentUserRoles: ColonyRole[];
  domainId: number;
  rootAccounts: Address[];
  userDirectRoles: ColonyRole[];
  currentUserRolesInRoot: ColonyRole[];
  userInheritedRoles: ColonyRole[];
  onDomainSelected: (domain: number) => void;
  onChangeSelectedUser: (user: AnyUser) => void;
  onMotionDomainChange: (domain: number) => void;
  inputDisabled: boolean;
  userHasPermission: boolean;
  isVotingExtensionEnabled: boolean;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const supRenderAvatar = (address: string, item: ItemDataType<AnyUser>) => (
  <UserAvatar address={address} user={item} size="xs" notSet={false} />
);

const PermissionManagementForm = ({
  colony: { colonyAddress, domains },
  colony,
  currentUserRoles,
  domainId,
  rootAccounts,
  userDirectRoles,
  userInheritedRoles,
  currentUserRolesInRoot,
  inputDisabled,
  userHasPermission,
  isVotingExtensionEnabled,
  onDomainSelected,
  onMotionDomainChange,
  onChangeSelectedUser,
  values,
}: Props & FormikProps<FormValues>) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: {
      colonyAddress,
    },
  });

  const domain = domains?.find(({ ethDomainId }) => ethDomainId === domainId);

  const canSetPermissionsInRoot =
    domainId === ROOT_DOMAIN_ID &&
    currentUserRoles.includes(ColonyRole.Root) &&
    (!userDirectRoles.includes(ColonyRole.Root) || rootAccounts.length > 1);
  const hasRoot = currentUserRolesInRoot.includes(ColonyRole.Root);
  const hasArchitectureInRoot = currentUserRolesInRoot.includes(
    ColonyRole.Architecture,
  );
  const canEditPermissions =
    (domainId === ROOT_DOMAIN_ID &&
      currentUserRolesInRoot.includes(ColonyRole.Root)) ||
    currentUserRolesInRoot.includes(ColonyRole.Architecture);
  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = useCallback(
    (role: ColonyRole) => {
      switch (role) {
        // Can't set arbitration at all yet
        case ColonyRole.Arbitration:
          return false;

        // Can only be set by root and in root domain (and only unset if other root accounts exist)
        case ColonyRole.Root:
        case ColonyRole.Recovery:
          return canSetPermissionsInRoot;

        // Must be root for these
        case ColonyRole.Administration:
        case ColonyRole.Funding:
          return hasArchitectureInRoot;

        // Can be set if root domain and has root OR has architecture in parent
        case ColonyRole.Architecture:
          return (
            (domainId === ROOT_DOMAIN_ID && hasRoot) || hasArchitectureInRoot
          );

        default:
          return false;
      }
    },
    [domainId, canSetPermissionsInRoot, hasArchitectureInRoot, hasRoot],
  );

  const domainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    domainId,
  ]);

  const directDomainRoles = useTransformer(getAllUserRolesForDomain, [
    colony,
    domainId,
    true,
  ]);

  const domainSelectOptions = sortBy(
    domains.map(({ ethDomainId, name }) => ({
      value: ethDomainId.toString(),
      label: name,
    })),
    ['value'],
  );

  const domainRolesArray = useMemo(
    () =>
      domainRoles
        .sort(({ roles }) => (roles.includes(ColonyRole.Root) ? -1 : 1))
        .filter(({ roles }) => !!roles.length)
        .map(({ address, roles }) => {
          const directUserRoles = directDomainRoles.find(
            ({ address: userAddress }) => userAddress === address,
          );
          return {
            userAddress: address,
            roles,
            directRoles: directUserRoles ? directUserRoles.roles : [],
          };
        }),
    [directDomainRoles, domainRoles],
  );

  const members = (colonyMembers?.subscribedUsers || []).map((user) => {
    const {
      profile: { walletAddress },
    } = user;
    const domainRole = domainRolesArray.find(
      (rolesObject) => rolesObject.userAddress === walletAddress,
    );
    return {
      ...user,
      roles: domainRole ? domainRole.roles : [],
      directRoles: domainRole ? domainRole.directRoles : [],
    };
  });

  const handleDomainChange = useCallback(
    (domainValue: string) => {
      const fromDomainId = parseInt(domainValue, 10);
      const selectedMotionDomainId = parseInt(values.motionDomainId, 10);
      onDomainSelected(fromDomainId);
      if (
        selectedMotionDomainId !== ROOT_DOMAIN_ID &&
        selectedMotionDomainId !== fromDomainId
      ) {
        onMotionDomainChange(fromDomainId);
      }
    },
    [onDomainSelected, onMotionDomainChange, values.motionDomainId],
  );

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
    (motionDomainId) => onMotionDomainChange(motionDomainId),
    [onMotionDomainChange],
  );

  const filteredRoles = useMemo(
    () =>
      domainId !== ROOT_DOMAIN_ID
        ? availableRoles.filter(
            (role) => role !== ColonyRole.Root && role !== ColonyRole.Recovery,
          )
        : availableRoles,
    [domainId],
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
                 * create a payment from that subdomain
                 */
                filterDomains={handleFilterMotionDomains}
                initialSelectedDomain={parseInt(values.domainId, 10)}
              />
            </div>
          )}
          <div className={styles.headingContainer}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
              textValues={{ domain: domain?.name }}
            />
            {canEditPermissions && isVotingExtensionEnabled && (
              <Toggle label={{ id: 'label.force' }} name="forceAction" />
            )}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            data={members}
            label={MSG.selectUser}
            name="user"
            filter={filterUserSelection}
            onSelected={onChangeSelectedUser}
            renderAvatar={supRenderAvatar}
            disabled={inputDisabled}
            placeholder={MSG.userPickerPlaceholder}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.domainSelectContainer}>
          <Select
            options={domainSelectOptions}
            label={MSG.domain}
            name="domainId"
            appearance={{ theme: 'grey' }}
            onChange={handleDomainChange}
          />
        </div>
        <InputLabel
          label={MSG.permissionsLabel}
          appearance={{ colorSchema: 'grey' }}
        />
        <div className={styles.permissionChoiceContainer}>
          {filteredRoles.map((role) => {
            const roleIsInherited =
              !userDirectRoles.includes(role) &&
              userInheritedRoles.includes(role);
            return (
              <PermissionManagementCheckbox
                key={role}
                disabled={
                  !isVotingExtensionEnabled
                    ? inputDisabled || !canRoleBeSet(role) || roleIsInherited
                    : false
                }
                role={role}
                asterisk={roleIsInherited}
                domainId={domainId}
              />
            );
          })}
        </div>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
        />
      </DialogSection>
    </>
  );
};

export default PermissionManagementForm;
