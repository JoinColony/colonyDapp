import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Address } from '~types/index';
import { InputLabel } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';

import PermissionCheckbox from './PermissionCheckbox';
import { availableRoles } from './constants';

import styles from './PermissionForm.css';

const MSG = defineMessages({
  permissionsLabel: {
    id: 'admin.ColonyPermissionEditDialog.permissionsLabel',
    defaultMessage: 'Permissions',
  },
  permissionInParent: {
    id: 'admin.ColonyPermissionEditDialog.permissionInParent',
    defaultMessage: '*Permission granted via parent domain. {learnMore}',
  },
  learnMore: {
    id: 'admin.ColonyPermissionEditDialog.learnMore',
    defaultMessage: 'Learn more',
  },
});

const DOMAINS_HELP_URL =
  // eslint-disable-next-line max-len
  'https://help.colony.io/hc/en-us/articles/360024588993-What-are-the-permissions-in-a-colony-';

interface Props {
  currentUserRoles: ColonyRole[];
  domainId: number;
  rootAccounts: Address[];
  userDirectRoles: ColonyRole[];
  userInheritedRoles: ColonyRole[];
}

const PermissionForm = ({
  currentUserRoles,
  domainId,
  rootAccounts,
  userDirectRoles,
  userInheritedRoles,
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

  return (
    <>
      <InputLabel label={MSG.permissionsLabel} />
      {availableRoles.map((role) => {
        const roleIsInherited =
          !userDirectRoles.includes(role) && userInheritedRoles.includes(role);
        return (
          <div key={role} className={styles.permissionChoiceContainer}>
            <PermissionCheckbox
              disabled={!canRoleBeSet(role) || roleIsInherited}
              role={role}
              asterisk={roleIsInherited}
            />
          </div>
        );
      })}
      <p className={styles.parentPermissionTip}>
        <FormattedMessage
          {...MSG.permissionInParent}
          values={{
            learnMore: (
              <ExternalLink text={MSG.learnMore} href={DOMAINS_HELP_URL} />
            ),
          }}
        />
      </p>
    </>
  );
};

export default PermissionForm;
