import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import sortBy from 'lodash/sortBy';

import { Address } from '~types/index';
import { DomainFieldsFragment } from '~data/generated';
import { InputLabel, Select, Annotations } from '~core/Fields';

import PermissionManagementCheckbox from './PermissionManagementCheckbox';
import { availableRoles } from './constants';

import styles from './PermissionManagementDialog.css';

const MSG = defineMessages({
  domain: {
    id: 'dashboard.PermissionManagementDialog.PermissionManagementForm.domain',
    defaultMessage: 'Domain',
  },
  permissionsLabel: {
    id: `dashboard
      .PermissionManagementDialog.PermissionManagementForm.permissionsLabel`,
    defaultMessage: 'Permissions',
  },
  annotation: {
    id:
      // eslint-disable-next-line max-len
      'dashboard.PermissionManagementDialog.PermissionManagementForm.annotation',
    defaultMessage: 'Explain why you’re making these changes (optional)',
  },
});

interface Props {
  currentUserRoles: ColonyRole[];
  domainId: number;
  rootAccounts: Address[];
  userDirectRoles: ColonyRole[];
  userInheritedRoles: ColonyRole[];
  colonyDomains: DomainFieldsFragment[];
  onDomainSelected: (domain: number) => void;
}

const PermissionManagementForm = ({
  currentUserRoles,
  domainId,
  rootAccounts,
  userDirectRoles,
  userInheritedRoles,
  colonyDomains,
  onDomainSelected,
}: Props) => {
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
          return (
            domainId === ROOT_DOMAIN_ID &&
            currentUserRoles.includes(ColonyRole.Root) &&
            (!userDirectRoles.includes(ColonyRole.Root) ||
              rootAccounts.length > 1)
          );

        // Must be root for these
        case ColonyRole.Administration:
        case ColonyRole.Funding:
        case ColonyRole.Architecture:
          return currentUserRoles.includes(ColonyRole.Root);

        default:
          return false;
      }
    },
    [currentUserRoles, domainId, rootAccounts, userDirectRoles],
  );

  const domainSelectOptions = sortBy(
    colonyDomains.map(({ ethDomainId, name }) => ({
      value: ethDomainId.toString(),
      label: name,
    })),
    ['value'],
  );

  const handleDomainChange = useCallback(
    (value: string) => onDomainSelected(Number(value)),
    [onDomainSelected],
  );

  return (
    <>
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
        {availableRoles.map((role) => {
          const roleIsInherited =
            !userDirectRoles.includes(role) &&
            userInheritedRoles.includes(role);
          return (
            <PermissionManagementCheckbox
              key={role}
              disabled={!canRoleBeSet(role) || roleIsInherited}
              role={role}
              asterisk={roleIsInherited}
              domainId={domainId}
            />
          );
        })}
      </div>
      <Annotations label={MSG.annotation} name="annotation" />
    </>
  );
};

export default PermissionManagementForm;
