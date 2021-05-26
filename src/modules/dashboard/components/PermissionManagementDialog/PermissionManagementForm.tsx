import React, { useCallback, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import { InputLabel, Select, Annotations } from '~core/Fields';
import { DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import PermissionRequiredInfo from '~core/PermissionRequiredInfo';
import SingleUserPicker, { filterUserSelection } from '~core/SingleUserPicker';
import Toggle from '~core/Fields/Toggle';
import { ItemDataType } from '~core/OmniPicker';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { Address } from '~types/index';
import { useColonySubscribedUsersQuery, AnyUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRolesForDomain } from '../../../transformers';
import { availableRoles } from './constants';

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
  onChangeSelectedUser,
}: Props) => {
  const { data: colonySubscribedUsers } = useColonySubscribedUsersQuery({
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

  const subscribedUsers = colonySubscribedUsers?.subscribedUsers || [];

  const members = subscribedUsers.map((user) => {
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
    (value: string) => onDomainSelected(Number(value)),
    [onDomainSelected],
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

  const requiredRoles: ColonyRole[] = [ColonyRole.Architecture];

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{
            size: 'medium',
            margin: 'none',
            theme: 'dark',
          }}
          text={MSG.title}
          textValues={{ domain: domain?.name }}
        />
        {canEditPermissions && isVotingExtensionEnabled && (
          <Toggle label={{ id: 'label.force' }} name="forceAction" />
        )}
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
                  inputDisabled || !canRoleBeSet(role) || roleIsInherited
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
