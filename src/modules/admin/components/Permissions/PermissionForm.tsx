import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Address, DomainsMapType } from '~types/index';
import { useTransformer } from '~utils/hooks';
import { InputLabel } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import { useLoggedInUser } from '~data/index';

import {
  getUserRoles,
  TEMP_getUserRolesWithRecovery,
  getAllRootAccounts,
} from '../../../transformers';
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
  colonyRecoveryRoles: Address[];
  domainId: number;
  domains: DomainsMapType;
  userAddress: Address | undefined;
  userRoles: ROLES[];
}

const PermissionForm = ({
  colonyRecoveryRoles,
  domainId,
  domains,
  userAddress,
  userRoles,
}: Props) => {
  const { walletAddress } = useLoggedInUser();

  const currentUserRoles = useTransformer(getUserRoles, [
    domains,
    domainId,
    walletAddress,
  ]);

  const userInheritedRoles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    domainId,
    userAddress,
  ]);

  const rootAccounts = useTransformer(getAllRootAccounts, [domains]);

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = useCallback(
    (role: ROLES) => {
      switch (role) {
        // Can't set arbitration at all yet
        case ROLES.ARBITRATION:
          return false;

        // Can only be set by root and in root domain (and only unset if other root accounts exist)
        case ROLES.ROOT:
        case ROLES.RECOVERY:
          return (
            domainId === ROOT_DOMAIN &&
            currentUserRoles.includes(ROLES.ROOT) &&
            (!userRoles.includes(ROLES.ROOT) || rootAccounts.length > 1)
          );

        // Must be root for these
        case ROLES.ADMINISTRATION:
        case ROLES.FUNDING:
        case ROLES.ARCHITECTURE:
          return currentUserRoles.includes(ROLES.ROOT);

        default:
          return false;
      }
    },
    [currentUserRoles, domainId, rootAccounts.length, userRoles],
  );

  return (
    <>
      <InputLabel label={MSG.permissionsLabel} />
      {availableRoles.map(role => {
        const roleIsInherited =
          !userRoles.includes(role) && userInheritedRoles.includes(role);
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
