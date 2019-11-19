import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Address, DomainsMapType } from '~types/index';
import { useSelector, useTransformer } from '~utils/hooks';
import { InputLabel } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';

import {
  getUserRoles,
  TEMP_getUserRolesWithRecovery,
} from '../../../transformers';
import { walletAddressSelector } from '../../../users/selectors';
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
  userAddress: Address | null;
  userRoles: ROLES[];
}

const PermissionForm = ({
  colonyRecoveryRoles,
  domainId,
  domains,
  userAddress,
  userRoles,
}: Props) => {
  // Get the current user's roles in the selected domain
  const currentUserAddress = useSelector(walletAddressSelector);

  const currentUserRoles = useTransformer(getUserRoles, [
    domains,
    domainId,
    currentUserAddress,
  ]);

  const userInheritedRoles = useTransformer(TEMP_getUserRolesWithRecovery, [
    domains,
    colonyRecoveryRoles,
    domainId,
    userAddress,
  ]);

  // Check which roles the current user is allowed to set in this domain
  const canRoleBeSet = useCallback(
    (role: ROLES) => {
      switch (role) {
        // Can't set arbitration at all yet
        case ROLES.ARBITRATION:
          return false;

        // Can only be set by root and in root domain
        case ROLES.ROOT:
        case ROLES.RECOVERY:
          return (
            domainId === ROOT_DOMAIN && currentUserRoles.includes(ROLES.ROOT)
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
    [currentUserRoles, domainId],
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
